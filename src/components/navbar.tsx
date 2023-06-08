import { useState } from "react";
import {
  Flex,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState<
    "left" | "right" | "top" | "bottom"
  >("left");

  return (
    <Flex>
      <IconButton
        aria-label="Open Menu"
        icon={<HamburgerIcon />}
        onClick={onOpen}
      />
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <ul>
                <li>
                  <Link href="/restaurantes">Restaurantes</Link>
                </li>
                <li>
                  <Link href="/clientes">Clientes</Link>
                </li>
                <li>
                  <Link href="/categorias">Categorias</Link>
                </li>
                <li>
                  <Link href="/productos">Productos</Link>
                </li>
              </ul>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  );
}
