pragma solidity ^0.4.22;

contract Medchain {
    address public admin;
    
    enum USERTYPES {
        ADMIN,
        AIRLINE,
        GROUNDCLEARANCE,
        CUSTOM,
        WAREHOUSE,
        DISTRIBUTOR,
        PHARMACY,
        NGO,
        CUSTOMER,
        DOCTOR
    }
    
    enum STATUS {
        CREATED,
        DISPATCHED,
        RECEIVED,
        DELIVERED
    }
    
    struct Batch {
        string batchId;
        uint noOfMedicines;
        string location;
        string currentOwnerName;
        address currentOwner;
        STATUS status;
        USERTYPES currentOwnerType;
        string sourceCountry;
        string destinationCountry;
    }
    
    struct BatchDate {
        string batchId;
        string manufacturedDate;
        string createdDate;
        string expiryDate;
        string deliveredDate;
    }
    mapping(address=>User) public users;
    mapping(string=>Batch) private batches;
    mapping(string=>BatchDate) private batchdates;
    
    modifier onlyAdmin(){
        require(msg.sender==admin);
        _;
    }
    
    modifier onlyvalidUser(){
        require(users[msg.sender].userAccount!=0);
        _;
    }
    
    modifier checkBatch(string _batchId){
        require(batches[_batchId].currentOwner!=0);
        _;
    }
    
    modifier canDispatch(string _batchId){
        require(batches[_batchId].status!=STATUS.DISPATCHED && batches[_batchId].currentOwner==msg.sender);
        _;
    }
    
    modifier canReceiveBatch(string _batchId) { 
        require(batches[_batchId].status!=STATUS.RECEIVED);
        _; 
    }
    
    modifier onlyValidDestination(string _batchId, string _destinationCountry) { 
        require(keccak256(batches[_batchId].destinationCountry)==keccak256(_destinationCountry));
        _;
    }
    modifier checkPreviousUser(string _batchId) { 
        require(uint(batches[_batchId].currentOwnerType)+1==uint(users[msg.sender].userType));
        _; 
    }
    modifier checkSameUser(string _batchId) { 
        require(batches[_batchId].currentOwner==msg.sender);
        _; 
    }
    
    
    struct User {
        string userName;
        address userAccount;
        USERTYPES userType;
    }
    function Medchain() public {
        admin = msg.sender;
        createUser("MedTrackAdmin", admin, USERTYPES.ADMIN);
    }
    
    function createUser(string _userName, address _useraccount, USERTYPES _userType) onlyAdmin public {
        User memory data = User(_userName,_useraccount, _userType);
        users[_useraccount]=data;
    }
    
    function createBatch(string _batchId,
                         uint _noOfMedicines,
                         string _manufacturedDate,
                         string _createdDate,
                         string _expirydate,
                         string _location,
                         string _sourceCountry,
                         string _destinationCountry) 
                         onlyAdmin 
                         public{
                             Batch memory data = Batch(_batchId, _noOfMedicines, _location,"MedTrackAdmin", admin,STATUS.CREATED, USERTYPES.ADMIN, _sourceCountry, _destinationCountry);
                             BatchDate memory datedata = BatchDate(_batchId, _manufacturedDate, _createdDate, _expirydate, "");
                             batches[_batchId] = data;
                             batchdates[_batchId]= datedata;
                         }
                         
    function getBatchData(string _batchId) 
    public 
    view
    returns(string, uint, string,string, address, STATUS, USERTYPES, string, string){
        Batch memory data = batches[_batchId];
        
        return (data.batchId, data.noOfMedicines, data.location,data.currentOwnerName, data.currentOwner, data.status, data.currentOwnerType, data.sourceCountry, data.destinationCountry);
    }
    
    function getBatchDateData(string _batchId) 
    public 
    view
    returns(string,string,string, string, string){
        BatchDate memory data = batchdates[_batchId];
        return (data.batchId ,data.manufacturedDate, data.expiryDate,data.createdDate, data.deliveredDate);
    }
    
    function dispatchBatch(string _batchId, string _destinationCountry)
    onlyvalidUser()
    checkBatch(_batchId)
    canReceiveBatch( _batchId)
    checkSameUser(_batchId)
    onlyValidDestination(_batchId,_destinationCountry)
    public
    {
        batches[_batchId].status = STATUS.DISPATCHED;
    }
    
    function receiveBatch(string _batchId, string _destinationCountry)
    onlyvalidUser()
    checkBatch(_batchId)
    canReceiveBatch( _batchId)
    checkPreviousUser(_batchId)
    onlyValidDestination(_batchId,_destinationCountry)
    public
    {
        batches[_batchId].status = STATUS.RECEIVED;
        batches[_batchId].currentOwner = msg.sender;
        batches[_batchId].currentOwnerType = users[msg.sender].userType;
        batches[_batchId].currentOwnerName = users[msg.sender].userName;
    }
    
}