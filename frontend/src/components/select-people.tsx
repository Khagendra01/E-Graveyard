import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectPeople() {
  return (
    <Select>
      <SelectTrigger className="w-[180px] mx-auto text-center">
        <SelectValue placeholder="Select people" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="Albert Einstein">Albert Einstein</SelectItem>
          <SelectItem value="Isaac Newton">Isaac Newton</SelectItem>
          <SelectItem value="Marie Curie">Marie Curie</SelectItem>
          <SelectItem value="Nikola Tesla">Nikola Tesla</SelectItem>
          <SelectItem value="Thomas Edison">Thomas Edison</SelectItem>
          <SelectItem value="create">+ Create new</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
