import React, { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Tabs, type TabProps } from "react-native-collapsible-tab-view";
import HeaderCollapsible from "./header-collapsible";

type ScreenProps = TabProps<string> & {
  children: ReactNode;
};

function Screen(_props: ScreenProps) {
  return null;
}

type TabsCollapsibleProps = {
  children: ReactNode;
};

function TabsCollapsible({ children }: Readonly<TabsCollapsibleProps>) {
  const screens = Children.toArray(children).filter(
    (child): child is ReactElement<ScreenProps> =>
      isValidElement(child) && child.type === Screen
  );

  return (
    <Tabs.Container renderHeader={HeaderCollapsible}>
      {screens.map(({ props }) => (
        <Tabs.Tab key={props.name} {...props}>
          {props.children}
        </Tabs.Tab>
      ))}
    </Tabs.Container>
  );
}

TabsCollapsible.Screen = Screen;

export default TabsCollapsible;