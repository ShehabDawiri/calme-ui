import {
  Blocks,
  Globe,
  Settings,
  Settings2,
  BrainCircuit,
  Building,
  PlugZap,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const items = [
  {
    title: "Templates",
    url: "#",
    items: [
      { title: "Template Libary", url: "#", icon: Blocks, isActive: true },
      { title: "Community", url: "#", icon: Globe, isActive: false },
    ],
  },
  {
    title: "Settings",
    url: "#",
    items: [
      { title: "Account", url: "#", icon: Settings, isActive: false },
      { title: "Preferences", url: "#", icon: Settings2, isActive: false },
      { title: "Memory", url: "#", icon: BrainCircuit, isActive: false },
      { title: "Team", url: "#", icon: Building, isActive: false },
      { title: "Integrations", url: "#", icon: PlugZap, isActive: false },
    ],
  },
];

export function NavMain() {
  const { open: isOpen } = useSidebar();
  return (
    <SidebarGroup className={"bg-primary-100"}>
      <SidebarMenu>
        <SidebarGroupContent>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <div>
                {isOpen ? (
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="text-primary-400 overflow-hidden text-xs text-nowrap"
                    >
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                ) : (
                  <Separator className="mb-2" />
                )}

                {item.items && (
                  <ul className="mt-1 space-y-1">
                    {item.items.map((subItem) => (
                      <li key={subItem.title}>
                        <SidebarMenuButton asChild isActive={subItem.isActive}>
                          <a
                            href={subItem.url}
                            className={`text-primary-400 ${isOpen && "ml-1"} flex items-center gap-2 overflow-hidden text-nowrap`}
                          >
                            <subItem.icon size={4} />
                            {subItem.title}
                          </a>
                        </SidebarMenuButton>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarGroupContent>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NavMain;
