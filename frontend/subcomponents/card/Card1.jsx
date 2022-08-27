import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { FaEthereum } from "react-icons/fa";
import { BsPersonCheckFill } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import Link from "next/link";
import { timeConverter } from "../../utils/DateConverter";
import { useRouter } from "next/router";

export default function Card1({
  imgSrc,
  category,
  title,
  description,
  address,
  requiredAmt,
  publishedDate,
  campaignAddress,
}) {
  const router = useRouter();
  return (
    <Card className="w-96 cursor-pointer md:hover:scale-105 transition-all hover:shadow-xl">
      <CardHeader floated={false} className="h-56">
        <Link href={`/${campaignAddress}`}>
          <img src={imgSrc} alt={category} />
        </Link>
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h5" className="mb-2">
          {title}
        </Typography>
        <Typography>{description.slice(0, 80)}...</Typography>
      </CardBody>

      <CardFooter divider className="flex items-center justify-between py-3">
        <Typography className="flex items-center gap-x-1" variant="lead">
          <FaEthereum className="text-[#3c3c3d]" /> {requiredAmt} ETH
        </Typography>
        <Typography
          variant="small"
          color="gray"
          className="flex gap-1 items-center"
        >
          <BsPersonCheckFill />
          {address && address.slice(0, 6)}...{address.slice(address.length - 4)}
        </Typography>
      </CardFooter>
      <CardFooter divider className="flex items-center justify-between py-3">
        <Typography variant="small">
          <Button
            onClick={() => router.push(`/${campaignAddress}`)}
            className="bg-primary px-8 flex items-center gap-x-2"
          >
            View <AiOutlineArrowRight className="text-lg" />
          </Button>
        </Typography>
        <Typography
          variant="small"
          color="gray"
          className="flex gap-1 items-center"
        >
          <MdDateRange />
          {timeConverter(publishedDate)}
        </Typography>
      </CardFooter>
    </Card>
  );
}
