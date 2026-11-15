import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderCollapsible from './header-collapsible';

import { useAppTheme } from '@/hooks/use-app-theme';

type ScreenProps = {
  name: string;
  label?: string;
  children: ReactNode;
};

function Screen(_props: ScreenProps) {
  return null;
}

function TabsCollapsible({ children }: Readonly<{ children: ReactNode }>) {
  const { colors } = useAppTheme();

  const screens = Children.toArray(children).filter(
    (child): child is ReactElement<ScreenProps> =>
      isValidElement(child) && child.type === Screen
  );
  const [selectedName, setSelectedName] = useState<string>();
  const activeName = screens.some(({ props }) => props.name === selectedName)
    ? selectedName
    : screens[0]?.props.name;
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % screens.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + screens.length) % screens.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = screens.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelectedName(screens[nextIndex].props.name);
    buttons.current[nextIndex]?.focus({ preventScroll: true });
  }

  const tabBase: CSSProperties = {
    minWidth: 88,
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    borderBottomWidth: 3,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    background: 'none',
    cursor: 'pointer',
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <header style={styles.header}>
        <HeaderCollapsible />
      </header>
      <View style={[styles.tablist, { backgroundColor: colors.background }]} role="tablist" aria-label="Profile sections">
        {screens.map(({ props }, index) => {
          const selected = props.name === activeName;
          const tabStyle: CSSProperties = {
            ...tabBase,
            borderBottomColor: selected ? colors.primary : 'transparent',
            color: selected ? colors.primary : colors.mutedText,
          };
          return (
            <button
              key={props.name}
              ref={(button) => { buttons.current[index] = button; }}
              style={tabStyle}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel-${index}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setSelectedName(props.name)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {props.label ?? props.name}
            </button>
          );
        })}
      </View>
      {screens
        .filter(({ props }) => props.name === activeName)
        .map(({ props }, index) => (
          <View
            key={props.name}
            style={[styles.panel, { flex: 1 }]}
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
          >
            {props.children}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100dvh',
    minHeight: 0,
    overflow: 'hidden',
    color: '#171717',
  },
  header: {
    padding: 20,
  },
  tablist: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    flexDirection: 'row',
    overflowX: 'hidden',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  panel: {
    minHeight: 'calc(100dvh - 3rem)',
  },
});

TabsCollapsible.Screen = Screen;

export default TabsCollapsible;
