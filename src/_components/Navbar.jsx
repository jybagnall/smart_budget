import Tab from "./Tab";
import tabLinks from "./tabLinks";
import LogoutSVG from "./LogoutSVG";

export default function Navbar() {
  return (
    <div
      as="nav"
      className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-3"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between w-full text-base sm:text-lg">
          <div className="flex flex-1 justify-evenly">
            {tabLinks.map((item) => (
              <Tab key={item.tabName} to={item.href}>
                {item.tabName}
              </Tab>
            ))}
          </div>
          <div>
            <LogoutSVG />
          </div>
        </div>
      </div>
    </div>
  );
}
