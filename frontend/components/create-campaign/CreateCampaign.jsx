import React, { useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { MdAddTask } from "react-icons/md";
import { useRouter } from "next/router";
import {
  Input,
  Textarea,
  Select,
  Option,
  Button,
  IconButton,
} from "@material-tailwind/react";
// import Button from "../../subcomponents/btns/Button";
import { categories } from "../../data";

export default function CreateCampaign() {
  const router = useRouter();
  const [isListing, setisListing] = useState(false);
  const [file, setFile] = useState();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
  });

  const onChangeFiles = async (e) => {
    const fileData = e.target.files[0];
    try {
      const add = await client.add(fileData, {
        progress: (prog) => console.log("Image is uploaded : ", prog),
      });
      const url = `https://ipfs.infura.io/ipfs/${add.path}`;
      setFile(url);
    } catch (error) {
      console.log(
        "Error in onChange function , You are in catch of ListItem component ",
        error
      );
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleClick = () => {
    const { name, price, description } = formData;
    if (!name || !price || !description || !file) {
      console.log("Some feild are missing");
      return;
    }
  };

  return (
    <div className="flex justify-center py-5 px-5">
      <div className="md:w-4/6 space-y-6">
        <Input color="green" variant="standard" name="title" onChange={handleInputChange} label="Campaign Title" />
        <Textarea color="green" variant="outlined"
          onChange={handleInputChange}
          label="Description (max:300 characters)"
          name="description"
        />
        <Input color="green" variant="standard" size="lg" type="file" name="image" onChange={onChangeFiles} label="Select Image" />
        <div className="flex gap-x-4 w-full justify-center">
          <Input color="green" variant="standard"
            name="amount"
            onChange={handleInputChange}
            label="Required Amount"
          />
          <Select color="green" variant="standard"
            onChange={(e) => console.log("changed value -> ", e)}
            label="Category"
          >
            {categories?.map((item, index) => (
              <Option value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </div>
        <Button className="flex items-center justify-center gap-x-2 bg-primary" fullWidth onClick={handleClick}>
           <MdAddTask className="text-xl text-white" />
          Create Campaign
        </Button>
      </div>
    </div>
  );
}
