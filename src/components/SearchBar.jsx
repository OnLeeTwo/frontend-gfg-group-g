import { Flex, Input } from "@chakra-ui/react";

export default function SearchBar( {parameters} ) {
    return (
        <Flex mb={10}>
              <Input placeholder={parameters} />
        </Flex>
    )
}