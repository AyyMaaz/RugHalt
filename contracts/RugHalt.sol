// SPDX-License-Identifier: MIT

//Official Code for the project is  below ..It is the code i used in the demo video i commented out some important features of
//the code just for the demo video

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract RugHalt is AutomationCompatibleInterface, Ownable {
    uint256 ProjectId = 0;

    //enums

    enum _projectstage {
        NEW,
        STARTED
    }

    enum _projectsummary {
        ACTIVE,
        MODERATE,
        BAD,
        RUGGED
    }

    //events

    event ProjectCreated(
        uint256 indexed ProjectId,
        address indexed organizer,
        uint256 timestamp,
        _projectstage stage,
        _projectsummary status,
        string name,
        string desc,
        string url,
        uint code,
        uint256 NumberOfVotes,
        uint256 NegativeVotes,
        uint256 PositiveVotes
    );

    event ProjectChanged(
        string name,
        string desc,
        string url,
        uint256 timestamp
    );

    event OwnerInfo(
        address indexed ProjectId,
        address indexed organizer,
        string organizerName,
        string pfp,
        string contactNum,
        string cnic,
        string discordUrl,
        string Address
    );

    // event ProjectOwnersTeam(uint256 indexed ProjectId, address[] team);
    event ProjectVoting(
        uint indexed ProjectId,
         uint NumberOfVotes,
        uint PositiveVotes,
        uint NegativeVotes,
         _projectsummary status,
        address[] voters,
        uint256 timestamp
       
    );


    event NegativeComments(
        uint256 indexed ProjectId,
        string description,
        uint256 totalvotes,
        uint256 pos,
        uint256 neg
 
    );

    event PositiveComments(
        uint256 indexed ProjectId,
        string description,
        uint256 totalvotes,
        uint256 pos,
        uint256 neg
       
    );

    //structs

    struct ProjectMetadata {
        address organizer;
        uint256 timestamp;
        _projectstage stage;
        _projectsummary status;
        string name;
        string desc;
        string url;
        uint code;
        uint256 NumberOfVotes;
        uint256 NegativeVotes;
        uint256 PositiveVotes;
        address[] projectVoters;
    }

    struct ProjectOwnerInfo {
        uint256 ProjectId;
        address organizer;
        string organizerName;
        string pfp;
        string contactNum;
        string cnic;
        string discordUrl;
        string Address;
    }

    struct projectNComment {
        string description;
        uint256 ProjectId;
        uint256 totalvotes;
        uint256 pos;
        uint256 neg;
    }

    struct projectPComment {
        string description;
        uint256 ProjectId;
        uint256 totalvotes;
        uint256 pos;
        uint256 neg;
    }
    //mapping

    mapping(uint256 => ProjectMetadata) public _projects;
    mapping(address => ProjectOwnerInfo) _owner;
    mapping(address => uint256[]) public projectOwners;
    mapping(uint256 => projectPComment[]) public _PComment;
    mapping(uint256 => projectNComment[]) public _NComment;
    mapping(address => bool) alreadyVoted;
    mapping(address => bool) alreadyCommented;

    //modifier
    // modifier alreadyvoted() {
    //     require(alreadyVoted[msg.sender] == false, "You have already Voted");
    //     _;
    // }
    // modifier alreadycommented() {
    //     require(
    //         alreadyCommented[msg.sender] == false,
    //         "You have already commented"
    //     );
    //     _;
    // }

    //enums stages
    function updateProjectStatus(uint256 _projectId, _projectsummary _status)
        internal
    {
        _projects[_projectId].status = _status;
    }

    function updateProjectStage(uint256 _projectId, _projectstage _stage)
        internal
    {
        _projects[_projectId].stage = _stage;
    }

    //project created by owner

    function GenerateCode(uint256 _projectId) internal returns (uint) {
        string memory _name = _projects[_projectId].name;
        string memory _url = _projects[_projectId].url;
        string memory _desc = _projects[_projectId].desc;

     uint leaf = uint(keccak256(abi.encodePacked(_name, _url, _desc)));
        _projects[_projectId].code = leaf;
        return leaf;
    }

    function CreateProject(
        string memory _name,
        string memory _desc,
        string memory _url
    ) public returns (uint256) {
        // require(bytes(_desc).length > 5, "Description is too short");

        _projects[ProjectId].organizer = msg.sender;
        _projects[ProjectId].timestamp = block.timestamp;
        _projects[ProjectId].stage = _projectstage.NEW;
        _projects[ProjectId].name = _name;
        _projects[ProjectId].url = _url;
        _projects[ProjectId].desc = _desc;

        projectOwners[msg.sender].push(ProjectId);
        GenerateCode(ProjectId);
        ProjectId++;
       uint _code = GenerateCode(ProjectId);

        emit ProjectCreated(
            ProjectId,
            msg.sender,
            block.timestamp,
            _projects[ProjectId].stage,
            _projects[ProjectId].status,
            _desc,
            _url,
            _name,
            _code,
            _projects[ProjectId].NumberOfVotes,
            _projects[ProjectId].PositiveVotes,
            _projects[ProjectId].NegativeVotes
        );

        return ProjectId;
    }

    //updation of project

    function UpdateprojectMetadata(
        uint256 _projectId,
        string memory _name,
        string memory _desc,
        string memory _url
    ) external payable {
        require(
            _projects[_projectId].stage == _projectstage.NEW,
            "project metadata can't change after it has started"
        );
        require(
            msg.value > 0.001 ether,
            "You dont have enough Money to update"
        );
        require(
            _projects[_projectId].organizer == msg.sender,
            "you are not the owner"
        );

        require(
            _projects[_projectId].timestamp <= 1 hours,
            "you are not the owner"
        );
        _projects[_projectId].timestamp = block.timestamp;
        _projects[_projectId].name = _name;
        _projects[_projectId].url = _url;
        _projects[_projectId].desc = _desc;

        emit ProjectChanged(_name, _desc, _url, block.timestamp);
    }

    //owners info

    function AddownersInfo(
        address _ProjectId,
        string memory _organizerName,
        string memory _pfp,
        string memory _contactNum,
        string memory _cnic,
        string memory _discordUrl,
        string memory _Address
    ) external {
        require(_ProjectId == msg.sender, "you are no owner");

        // updateProjectStage(_ProjectId, _projectstage.STARTED);
        ProjectOwnerInfo storage owner = _owner[_ProjectId];
        owner.organizer = msg.sender;
        owner.organizerName = _organizerName;
        owner.pfp = _pfp;
        owner.contactNum = _contactNum;
        owner.cnic = _cnic;
        owner.discordUrl = _discordUrl;
        owner.Address = _Address;

        emit OwnerInfo(
            _ProjectId,
            msg.sender,
            _organizerName,
            _pfp,
            _contactNum,
            _cnic,
            _discordUrl,
            _Address
        );
    }

    //votings

    function AddProjectPosComment(
        string memory _code,
        uint256 _projectId,
        string memory _description
    ) external //alreadycommented {
        {
        require(
            _PComment[_projectId].length <= 2,
            "Maximum Limit is 2 Comments Now u can vote on the Comments"
        );

        // require(
        //     _projects[_projectId].organizer != msg.sender,
        //     "You are the owner,You cant create this"
        // );
        // require(_projects[_projectId].code == _code, "Wrong Code");

        uint256 CommentId = _PComment[_projectId].length;
        _PComment[_projectId].push();

        projectPComment storage Comment = _PComment[_projectId][CommentId];

        Comment.description = _description;
        Comment.ProjectId = _projectId;
        //alreadyCommented[msg.sender] = true;

        emit PositiveComments(
            _projectId,
            _description,
            _PComment[_projectId][CommentId].totalvotes,
            _PComment[_projectId][CommentId].pos,
            _PComment[_projectId][CommentId].neg
    
        );
    }

    function AddProjectNegComment(
       string memory _code,
        uint256 _projectId,
        string memory _description
    ) external //alreadycommented {
          {
        require(
            _NComment[_projectId].length <= 2,
            "Maximum Limit is 2 Comments Now u can vote on the Comments"
        );

        // require(
        //     _projects[_projectId].organizer != msg.sender,
        //     "You are the owner,You cant create this"
        // );

        uint256 CommentId = _NComment[_projectId].length;
        _NComment[_projectId].push();

        projectNComment storage Comment = _NComment[_projectId][CommentId];

        Comment.description = _description;
        Comment.ProjectId = _projectId;
        //alreadyCommented[msg.sender] = true;
        emit NegativeComments(
            _projectId,
            _description,
            _NComment[_projectId][CommentId].totalvotes,
            _NComment[_projectId][CommentId].pos,
            _NComment[_projectId][CommentId].neg
    

        );
    }

    function PositiveVoteOnProjects(uint256 _projectId, uint256 _CommentId)
        external
        //alreadyvoted
    {
        require(
            _PComment[_projectId].length > 0,
            "No Comment founded.You can create your own Comment to vote"
        );
        // require(
        //     _projects[_projectId].organizer != msg.sender,
        //     "You are the owner,You cant do this"
        // );
        _projects[_projectId].NumberOfVotes += 1;
        _projects[_projectId].PositiveVotes += 1;
        _projects[_projectId].projectVoters.push(msg.sender);
        _PComment[_projectId][_CommentId].pos += 1;
        _PComment[_projectId][_CommentId].totalvotes += 1;
        //alreadyVoted[msg.sender] = true;
        _projects[_projectId].projectVoters.push(msg.sender);
        emit ProjectVoting(
            _projectId,
            _projects[_projectId].NumberOfVotes,
            _projects[_projectId].PositiveVotes,
            _projects[_projectId].NegativeVotes,
             _projects[_projectId].status,
            _projects[_projectId].projectVoters,
            block.timestamp
        );
    }

    function NegativeVoteOnProjects(uint256 _projectId, uint256 _CommentId)
        external
       // alreadyvoted
    {
        require(
            _NComment[_projectId].length > 0,
            "No Comment founded.You can create your own Comment to vote"
        );
       
        // require(
        //     _projects[_projectId].organizer != msg.sender,
        //     "You are the owner,You cant do this"
        // );

        _projects[_projectId].NumberOfVotes += 1;
        _projects[_projectId].NegativeVotes += 1;
        _projects[_projectId].projectVoters.push(msg.sender);

        _NComment[_projectId][_CommentId].neg += 1;
        _NComment[_projectId][_CommentId].totalvotes += 1;
        //alreadyVoted[msg.sender] = true;
        _projects[_projectId].projectVoters.push(msg.sender);
        emit ProjectVoting(
            _projectId,
            _projects[_projectId].NumberOfVotes,
            _projects[_projectId].PositiveVotes,
            _projects[_projectId].NegativeVotes,
             _projects[_projectId].status,
            _projects[_projectId].projectVoters,
            block.timestamp
        );
    }

    //getter functions

    function GetOwnerOfTheProject(address _id)
        public
        view
        returns (string memory)
    {
        return _owner[_id].organizerName;
    }

    function GetProjectOwnersByAddress(address _id)
        public
        view
        returns (uint256[] memory)
    {
        return projectOwners[_id];
    }

    //chainLink working

    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        for (uint256 id = 0; id < ProjectId; id++) {
            uint256 NegAverage = ((_projects[id].NegativeVotes * 100) /
                _projects[id].NumberOfVotes);
            bool change;

            if (NegAverage == 0) {
                change = true;
            }
            if (NegAverage <= 50 && NegAverage > 0) {
                change = true;
            }

            if (NegAverage > 50 && NegAverage <= 75) {
                change = true;
            }

            if (NegAverage > 75) {
                change = true;
            }

            upkeepNeeded = change;
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        for (uint256 id = 0; id < ProjectId; id++) {
            uint256 NegAverage = ((_projects[id].NegativeVotes * 100) /
                _projects[id].NumberOfVotes);

            if (NegAverage == 0) {
                updateProjectStatus(id, _projectsummary.ACTIVE);
            }
            if (NegAverage <= 50 && NegAverage > 0) {
                updateProjectStatus(id, _projectsummary.MODERATE);
            }

            if (NegAverage > 50 && NegAverage <= 75) {
                updateProjectStatus(id, _projectsummary.BAD);
            }

            if (NegAverage > 75) {
                updateProjectStatus(id, _projectsummary.RUGGED);
            }
        }
    }
}


//Official Code



// pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

// contract RugHalt is AutomationCompatibleInterface, Ownable {
//     uint256 ProjectId = 0;

//     //enums

//     enum _projectstage {
//         NEW,
//         STARTED
//     }

//     enum _projectsummary {
//         ACTIVE,
//         MODERATE,
//         BAD,
//         RUGGED
//     }

//     //events

//     event ProjectCreated(
//         uint256 indexed ProjectId,
//         address indexed organizer,
//         uint256 timestamp,
//         _projectstage stage,
//         _projectsummary status,
//         string name,
//         string desc,
//         string url,
//         uint code,
//         uint256 NumberOfVotes,
//         uint256 NegativeVotes,
//         uint256 PositiveVotes
//     );

//     event ProjectChanged(
//         string name,
//         string desc,
//         string url,
//         uint256 timestamp
//     );

//     event OwnerInfo(
//         address indexed ProjectId,
//         address indexed organizer,
//         string organizerName,
//         string pfp,
//         string contactNum,
//         string cnic,
//         string discordUrl,
//         string Address
//     );

//     // event ProjectOwnersTeam(uint256 indexed ProjectId, address[] team);
//     event ProjectVoting(
//         uint indexed ProjectId,
//          uint NumberOfVotes,
//         uint PositiveVotes,
//         uint NegativeVotes,
//          _projectsummary status,
//         address[] voters,
//         uint256 timestamp
       
//     );


//     event NegativeComments(
//         uint256 indexed ProjectId,
//         string description,
//         uint256 totalvotes,
//         uint256 pos,
//         uint256 neg
 
//     );

//     event PositiveComments(
//         uint256 indexed ProjectId,
//         string description,
//         uint256 totalvotes,
//         uint256 pos,
//         uint256 neg
       
//     );

//     //structs

//     struct ProjectMetadata {
//         address organizer;
//         uint256 timestamp;
//         _projectstage stage;
//         _projectsummary status;
//         string name;
//         string desc;
//         string url;
//         uint code;
//         uint256 NumberOfVotes;
//         uint256 NegativeVotes;
//         uint256 PositiveVotes;
//         address[] projectVoters;
//     }

//     struct ProjectOwnerInfo {
//         uint256 ProjectId;
//         address organizer;
//         string organizerName;
//         string pfp;
//         string contactNum;
//         string cnic;
//         string discordUrl;
//         string Address;
//     }

//     struct projectNComment {
//         string description;
//         uint256 ProjectId;
//         uint256 totalvotes;
//         uint256 pos;
//         uint256 neg;
//     }

//     struct projectPComment {
//         string description;
//         uint256 ProjectId;
//         uint256 totalvotes;
//         uint256 pos;
//         uint256 neg;
//     }
//     //mapping

//     mapping(uint256 => ProjectMetadata) public _projects;
//     mapping(address => ProjectOwnerInfo) _owner;
//     mapping(address => uint256[]) public projectOwners;
//     mapping(uint256 => projectPComment[]) public _PComment;
//     mapping(uint256 => projectNComment[]) public _NComment;
//     mapping(address => bool) alreadyVoted;
//     mapping(address => bool) alreadyCommented;

//     //modifier
//     modifier alreadyvoted() {
//         require(alreadyVoted[msg.sender] == false, "You have already Voted");
//         _;
//     }
//     modifier alreadycommented() {
//         require(
//             alreadyCommented[msg.sender] == false,
//             "You have already commented"
//         );
//         _;
//     }

//     //enums stages
//     function updateProjectStatus(uint256 _projectId, _projectsummary _status)
//         internal
//     {
//         _projects[_projectId].status = _status;
//     }

//     function updateProjectStage(uint256 _projectId, _projectstage _stage)
//         internal
//     {
//         _projects[_projectId].stage = _stage;
//     }

//     //project created by owner

//     function GenerateCode(uint256 _projectId) internal returns (uint) {
//         string memory _name = _projects[_projectId].name;
//         string memory _url = _projects[_projectId].url;
//         string memory _desc = _projects[_projectId].desc;

//      uint leaf = uint(keccak256(abi.encodePacked(_name, _url, _desc)));
//         _projects[_projectId].code = leaf;
//         return leaf;
//     }

//     function CreateProject(
//         string memory _name,
//         string memory _desc,
//         string memory _url
//     ) public returns (uint256) {
//         require(bytes(_desc).length > 5, "Description is too short");

//         _projects[ProjectId].organizer = msg.sender;
//         _projects[ProjectId].timestamp = block.timestamp;
//         _projects[ProjectId].stage = _projectstage.NEW;
//         _projects[ProjectId].name = _name;
//         _projects[ProjectId].url = _url;
//         _projects[ProjectId].desc = _desc;

//         projectOwners[msg.sender].push(ProjectId);
//         GenerateCode(ProjectId);
//         ProjectId++;
//        uint _code = GenerateCode(ProjectId);

//         emit ProjectCreated(
//             ProjectId,
//             msg.sender,
//             block.timestamp,
//             _projects[ProjectId].stage,
//             _projects[ProjectId].status,
//             _desc,
//             _url,
//             _name,
//             _code,
//             _projects[ProjectId].NumberOfVotes,
//             _projects[ProjectId].PositiveVotes,
//             _projects[ProjectId].NegativeVotes
//         );

//         return ProjectId;
//     }

//     //updation of project

//     function UpdateprojectMetadata(
//         uint256 _projectId,
//         string memory _name,
//         string memory _desc,
//         string memory _url
//     ) external payable {
//         require(
//             _projects[_projectId].stage == _projectstage.NEW,
//             "project metadata can't change after it has started"
//         );
//         require(
//             msg.value > 0.001 ether,
//             "You dont have enough Money to update"
//         );
//         require(
//             _projects[_projectId].organizer == msg.sender,
//             "you are not the owner"
//         );

//         require(
//             _projects[_projectId].timestamp <= 1 hours,
//             "you are not the owner"
//         );
//         _projects[_projectId].timestamp = block.timestamp;
//         _projects[_projectId].name = _name;
//         _projects[_projectId].url = _url;
//         _projects[_projectId].desc = _desc;

//         emit ProjectChanged(_name, _desc, _url, block.timestamp);
//     }

//     //owners info

//     function AddownersInfo(
//         address _ProjectId,
//         string memory _organizerName,
//         string memory _pfp,
//         string memory _contactNum,
//         string memory _cnic,
//         string memory _discordUrl,
//         string memory _Address
//     ) external {
//         require(_ProjectId == msg.sender, "you are no owner");

//         // updateProjectStage(_ProjectId, _projectstage.STARTED);
//         ProjectOwnerInfo storage owner = _owner[_ProjectId];
//         owner.organizer = msg.sender;
//         owner.organizerName = _organizerName;
//         owner.pfp = _pfp;
//         owner.contactNum = _contactNum;
//         owner.cnic = _cnic;
//         owner.discordUrl = _discordUrl;
//         owner.Address = _Address;

//         emit OwnerInfo(
//             _ProjectId,
//             msg.sender,
//             _organizerName,
//             _pfp,
//             _contactNum,
//             _cnic,
//             _discordUrl,
//             _Address
//         );
//     }

//     //votings

//     function AddProjectPosComment(
//         string memory _code,
//         uint256 _projectId,
//         string memory _description
//     ) external alreadycommented 
//         {
//         require(
//             _PComment[_projectId].length <= 2,
//             "Maximum Limit is 2 Comments Now u can vote on the Comments"
//         );

//         require(
//             _projects[_projectId].organizer != msg.sender,
//             "You are the owner,You cant create this"
//         );
//         // require(uint(_projects[_projectId].code == _code, "Wrong Code");

//         uint256 CommentId = _PComment[_projectId].length;
//         _PComment[_projectId].push();

//         projectPComment storage Comment = _PComment[_projectId][CommentId];

//         Comment.description = _description;
//         Comment.ProjectId = _projectId;
//         alreadyCommented[msg.sender] = true;

//         emit PositiveComments(
//             _projectId,
//             _description,
//             _PComment[_projectId][CommentId].totalvotes,
//             _PComment[_projectId][CommentId].pos,
//             _PComment[_projectId][CommentId].neg
    
//         );
//     }

//     function AddProjectNegComment(
//        string memory _code,
//         uint256 _projectId,
//         string memory _description
//     ) external //alreadycommented {
//           {
//         require(
//             _NComment[_projectId].length <= 2,
//             "Maximum Limit is 2 Comments Now u can vote on the Comments"
//         );

//         require(
//             _projects[_projectId].organizer != msg.sender,
//             "You are the owner,You cant create this"
//         );

//         uint256 CommentId = _NComment[_projectId].length;
//         _NComment[_projectId].push();

//         projectNComment storage Comment = _NComment[_projectId][CommentId];

//         Comment.description = _description;
//         Comment.ProjectId = _projectId;
//         alreadyCommented[msg.sender] = true;
//         emit NegativeComments(
//             _projectId,
//             _description,
//             _NComment[_projectId][CommentId].totalvotes,
//             _NComment[_projectId][CommentId].pos,
//             _NComment[_projectId][CommentId].neg
    

//         );
//     }

//     function PositiveVoteOnProjects(uint256 _projectId, uint256 _CommentId)
//         external
//         alreadyvoted
//     {
//         require(
//             _PComment[_projectId].length > 0,
//             "No Comment founded.You can create your own Comment to vote"
//         );
//         require(
//             _projects[_projectId].organizer != msg.sender,
//             "You are the owner,You cant do this"
//         );
//         _projects[_projectId].NumberOfVotes += 1;
//         _projects[_projectId].PositiveVotes += 1;
//         _projects[_projectId].projectVoters.push(msg.sender);
//         _PComment[_projectId][_CommentId].pos += 1;
//         _PComment[_projectId][_CommentId].totalvotes += 1;
//         alreadyVoted[msg.sender] = true;
//         _projects[_projectId].projectVoters.push(msg.sender);
//         emit ProjectVoting(
//             _projectId,
//             _projects[_projectId].NumberOfVotes,
//             _projects[_projectId].PositiveVotes,
//             _projects[_projectId].NegativeVotes,
//              _projects[_projectId].status,
//             _projects[_projectId].projectVoters,
//             block.timestamp
//         );
//     }

//     function NegativeVoteOnProjects(uint256 _projectId, uint256 _CommentId)
//         external
//        alreadyvoted
//     {
//         require(
//             _NComment[_projectId].length > 0,
//             "No Comment founded.You can create your own Comment to vote"
//         );
       
//         require(
//             _projects[_projectId].organizer != msg.sender,
//             "You are the owner,You cant do this"
//         );

//         _projects[_projectId].NumberOfVotes += 1;
//         _projects[_projectId].NegativeVotes += 1;
//         _projects[_projectId].projectVoters.push(msg.sender);

//         _NComment[_projectId][_CommentId].neg += 1;
//         _NComment[_projectId][_CommentId].totalvotes += 1;
//         alreadyVoted[msg.sender] = true;
//         _projects[_projectId].projectVoters.push(msg.sender);
//         emit ProjectVoting(
//             _projectId,
//             _projects[_projectId].NumberOfVotes,
//             _projects[_projectId].PositiveVotes,
//             _projects[_projectId].NegativeVotes,
//              _projects[_projectId].status,
//             _projects[_projectId].projectVoters,
//             block.timestamp
//         );
//     }

//     //getter functions

//     function GetOwnerOfTheProject(address _id)
//         public
//         view
//         returns (string memory)
//     {
//         return _owner[_id].organizerName;
//     }

//     function GetProjectOwnersByAddress(address _id)
//         public
//         view
//         returns (uint256[] memory)
//     {
//         return projectOwners[_id];
//     }

//     //chainLink working

//     function checkUpkeep(bytes calldata checkData)
//         external
//         view
//         override
//         returns (bool upkeepNeeded, bytes memory performData)
//     {
//         for (uint256 id = 0; id < ProjectId; id++) {
//             uint256 NegAverage = ((_projects[id].NegativeVotes * 100) /
//                 _projects[id].NumberOfVotes);
//             bool change;

//             if (NegAverage == 0) {
//                 change = true;
//             }
//             if (NegAverage <= 50 && NegAverage > 0) {
//                 change = true;
//             }

//             if (NegAverage > 50 && NegAverage <= 75) {
//                 change = true;
//             }

//             if (NegAverage > 75) {
//                 change = true;
//             }

//             upkeepNeeded = change;
//         }
//     }

//     function performUpkeep(bytes calldata performData) external override {
//         for (uint256 id = 0; id < ProjectId; id++) {
//             uint256 NegAverage = ((_projects[id].NegativeVotes * 100) /
//                 _projects[id].NumberOfVotes);

//             if (NegAverage == 0) {
//                 updateProjectStatus(id, _projectsummary.ACTIVE);
//             }
//             if (NegAverage <= 50 && NegAverage > 0) {
//                 updateProjectStatus(id, _projectsummary.MODERATE);
//             }

//             if (NegAverage > 50 && NegAverage <= 75) {
//                 updateProjectStatus(id, _projectsummary.BAD);
//             }

//             if (NegAverage > 75) {
//                 updateProjectStatus(id, _projectsummary.RUGGED);
//             }
//         }
//     }
// }
