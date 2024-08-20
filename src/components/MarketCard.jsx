import {
    Image,
    Stack,
    Heading,
    Card,
    ButtonGroup,
    Button,
    Text,
    CardBody,
    CardFooter
} from '@chakra-ui/react'
import Link from 'next/link'

export default function MarketCard({ id, name, image, location }) {
    return (
        <Card maxW='sm' variant="outlined" backgroundColor='#C6A969' minHeight={300} maxHeight={700}>
            <CardBody>
                <Image
                    src={image}
                    alt={`Market ${name} on ${location}`}
                    borderRadius='sm'
                />
                <Stack mt='2' spacing='1'>
                    <Heading size='md'>{name}</Heading>
                    <Text color='white' fontSize='sm'>
                        {location}
                    </Text>
                </Stack>
            </CardBody>
           
            <CardFooter>
                <ButtonGroup spacing='2'>
                    <Button variant='solid' colorScheme='blue' size="xs">
                     <Link href={`/market/${id}`}>
                        View Market
                       </Link>
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}