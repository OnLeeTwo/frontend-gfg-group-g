import { Box, Alert, AlertIcon } from "@chakra-ui/react"

export const ErrorData = (error, errorStatus) => {
    return (
        <Box mt={10} mb={10}>
        <Alert status={errorStatus}>
          <AlertIcon />
          {error.message || "An error occurred while fetching this market."}
        </Alert>
      </Box>
    )
}