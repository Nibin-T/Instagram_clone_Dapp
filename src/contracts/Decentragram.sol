pragma solidity ^0.5.0;

contract Decentragram {
  string public name = "nibin";

  mapping (uint => Image) public images;
  uint public imgcount = 0;

  struct Image{
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }
  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );
  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  function uploadImage(string memory _imgHash,string memory _imgDes) public{
    require(bytes(_imgHash).length>0);
    require(bytes(_imgDes).length>0);
    require(msg.sender != address(0x0));
    
    
    imgcount++;
    images[imgcount] = Image(imgcount,_imgHash,_imgDes,0,msg.sender);
    emit ImageCreated(imgcount,_imgHash,_imgDes,0,msg.sender);
  }

  function tipImageOwner(uint _id) public payable{
    require(_id > 0 && _id <= imgcount);
    Image memory _image = images[_id];
    address payable _author = _image.author;
    address(_author).transfer(msg.value);
    _image.tipAmount += msg.value; 
    images[_id] = _image;
    emit ImageTipped(_id,_image.hash,_image.description,_image.tipAmount,_author);
    
  }

 

}