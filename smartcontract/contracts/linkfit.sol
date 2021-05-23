pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract LinkFitToken is ERC20, ChainlinkClient {
    uint private constant TOTAL_SUPPLY = 10**27;
    string private constant NAME = 'TST LinkFit Token';
    string private constant SYMBOL = 'TLFIT';

    uint256 public volume;
   
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    string private apiUrl;

    mapping (bytes32 => address) private requests;
    mapping (address => uint256) private _steps; // todo: temp to test 

    constructor(address _oracle, string memory _jobId, uint256 _fee, address _link, string memory _apiUrl) public ERC20(NAME, SYMBOL) {
        _mint(msg.sender, TOTAL_SUPPLY);

        if (_link == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_link);
        }
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;
        setApiUrl(_apiUrl);
    }

    function setApiUrl(string memory _apiUrl) public {
        apiUrl = _apiUrl;
    }

    function requestRedemption(address recipient) public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
             
        // Set the URL to perform the GET request on
        request.add("get", buildUrl(recipient));
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "VOLUME24HOUR": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        request.add("path", "steps");
           
        // Sends the request
        bytes32 reqId = sendChainlinkRequestTo(oracle, request, fee);

        // Save recipient address with this requestId
        requests[reqId] = recipient;
        return reqId;
    }
    
    // Receive the response in the form of uint256
    function fulfill(bytes32 requestId, uint256 steps) public recordChainlinkFulfillment(requestId) {
        // find recipient address for the request
        address recipient = requests[requestId];

        //todo: temp to test
        _steps[recipient] = steps;

        // do stuff with steps to fund
        // redemption rate per step should be stored in the sc

        // cleanup
        delete requests[requestId];        
    }

    // TODO: temp to test
    function getSteps(address recipient) public view returns (uint256 result) {
        return _steps[recipient];        
    }

    function buildUrl(address recipient) public view returns (string memory result) {
        string memory addr = string(addressToString(recipient));
        return string(abi.encodePacked(apiUrl,"/steps?cryptoaddr=", addr));        
    }

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function addressToString(address x) internal view returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = ascchar(hi);
            s[2*i+1] = ascchar(lo);            
        }
        return string(s);
    }

    function ascchar(bytes1 b) internal view returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
