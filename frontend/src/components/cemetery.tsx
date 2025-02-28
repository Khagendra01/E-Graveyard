import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

export default function Cemetery({
  imageName,
  id,
  name,
  personImage,
  is_alive
}: {
  imageName: string;
  id: string;
  name: string;
  personImage: string;
  is_alive: boolean;
}) {
  return (
    <Link
      to={id == "create" ? "/create" : `/people/${id}`}
      className="relative"
    >
      {is_alive ? (<img className="w-64" src={`/earth.png`} alt="" />) : (<img className="w-64" src={`/cemetery/${imageName}.png`} alt="" />)}
      {personImage === "plus" ? (
        <div className="absolute rounded-full w-24 h-24 bg-white text-black bottom-8 left-1/2 transform -translate-x-1/2 grid place-items-center">
          <PlusIcon className="text-black w-8 h-8" />
        </div>
      ) : (
        <img
          src={personImage}
          alt=""
          className="absolute rounded-full w-24 h-24 object-cover bottom-8 left-1/2 transform -translate-x-1/2"
        />
      )}

      <strong>{name}</strong>
    </Link>
  );
}
