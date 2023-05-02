import { Box, IconButton, Icon } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

function FloatingActionButton(props: { onClick: () => void }) {
  const { onClick } = props;

  return (
    <Box position="fixed" bottom={4} right={4} zIndex={10}>
      <IconButton
        icon={<Icon as={AddIcon} />}
        aria-label="Add"
        isRound={true}
        onClick={onClick}
      />
    </Box>
  );
}

export default FloatingActionButton;
