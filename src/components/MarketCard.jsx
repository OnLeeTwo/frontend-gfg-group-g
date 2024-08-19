import {
    Image,
    Stack,
    Heading,
    Card,
    ButtonGroup,
    Divider,
    Button,
    Text,
    CardBody,
    CardFooter
} from '@chakra-ui/react'
import Link from 'next/link'

export default function MarketCard({ id, name, description, image, location }) {
    return (
        <Card maxW='sm' variant="filled" height={400}>
            <CardBody>
                <Image
                    src={image}
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>{name}</Heading>
                    <Text>
                       {description}
                    </Text>
                    <Text color='blue.600' fontSize='2xl'>
                        {location}
                    </Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <ButtonGroup spacing='2'>
                    <Button variant='solid' colorScheme='blue'>
                       <Link href={`/market/${id}`}>
                        View Detail Market
                       </Link>
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}