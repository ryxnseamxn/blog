import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import HeaderCollapsible from "./header-collapsible";

// Keep this web entry point independent of the native pager dependency.
type ScreenProps = {
  name: string;
  label?: string;
  children: ReactNode;
};

function Screen(_props: ScreenProps) {
  return null;
}

function TabsCollapsible({ children }: Readonly<{ children: ReactNode }>) {
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
      case "ArrowRight":
        nextIndex = (index + 1) % screens.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + screens.length) % screens.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = screens.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelectedName(screens[nextIndex].props.name);
    buttons.current[nextIndex]?.focus({ preventScroll: true });
  }

  return (
    <div className="h-dvh min-h-0 overflow-y-auto bg-white text-neutral-900">
      <header>
        <HeaderCollapsible />
      </header>
      <div className="sticky top-0 z-10 flex h-12 overflow-x-auto bg-white shadow-[0_1px_0_#ddd]" role="tablist" aria-label="Profile sections">
        {screens.map(({ props }, index) => (
          <button
            key={props.name}
            ref={(button) => { buttons.current[index] = button; }}
            className="min-w-[88px] flex-[1_0_auto] cursor-pointer border-0 border-b-[3px] border-solid border-transparent bg-transparent px-5 font-semibold text-neutral-600 outline-offset-[-4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#007aff] aria-selected:border-b-[#007aff] aria-selected:text-[#007aff]"
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={props.name === activeName}
            tabIndex={props.name === activeName ? 0 : -1}
            onClick={() => setSelectedName(props.name)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {props.label ?? props.name}
          </button>
        ))}
      </div>
      {/* Keep panels mounted so switching tabs preserves their local state. */}
      {screens.map(({ props }, index) => (
        <section
          key={props.name}
          className="box-border min-h-[calc(100dvh-3rem)] outline-offset-[-4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#007aff]"
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={props.name !== activeName}
          tabIndex={0}
        >
          {props.children}
        </section>
      ))}
    </div>
  );
}

TabsCollapsible.Screen = Screen;

export default TabsCollapsible;
