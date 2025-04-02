import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

export default function MenuDropDownButton({ headTo, link }) {
  return (
    <Menu as="div" className="relative ml-3 inline-block text-left">
      <div>
        <MenuButton className="-my-2 flex items-center rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-hidden">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-5 z-10 mt-2 w-fit origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-none"
      >
        <div className="py-1">
          <MenuItem>
            <a
              href={link}
              className="flex items-center justify-center px-3 py-0.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
            >
              <span>{headTo}</span>
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
