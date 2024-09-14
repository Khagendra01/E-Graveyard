import { Link } from "react-router-dom";

export default function Cemetery({
  imageName,
  id,
  name,
}: {
  imageName: string;
  id: string;
  name: string;
}) {
  return (
    <Link to={`/people/${id}`} className="relative">
      <img className="w-64" src={`/cemetery/${imageName}.png`} alt="" />
      <img
        src="/people/steve-jobs.webp"
        alt=""
        className="absolute rounded-full w-24 h-24 object-cover bottom-8 left-1/2 transform -translate-x-1/2"
      />
      <strong>{name}</strong>
    </Link>
  );
}
