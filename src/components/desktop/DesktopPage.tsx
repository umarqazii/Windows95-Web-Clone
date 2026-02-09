import React, { useState, useEffect, useRef } from "react";

// --- Helpers & Data ---
const WINDOWS_ICONS_BASE = "https://win98icons.alexmeub.com/icons/png/";
const getIcon = (name: string) => `${WINDOWS_ICONS_BASE}${name}.png`;

const desktopIcons = [
  { id: "my-computer", label: "My Computer", src: getIcon("computer_explorer-0") },
  { id: "inbox", label: "Inbox", src: getIcon("mailbox_world-0") },
  { id: "recycle", label: "Recycle Bin", src: getIcon("recycle_bin_empty-0") },
  { id: "briefcase", label: "My Briefcase", src: getIcon("briefcase-0") },
  { id: "ie", label: "Internet Explorer", src: getIcon("msie2-5") },
];

const startMenuItems = [
  { label: "Programs", icon: getIcon("appwizard-4"), hasArrow: true },
  { label: "Documents", icon: getIcon("directory_open_file_mydocs-4"), hasArrow: true },
  { label: "Settings", icon: getIcon("settings_gear-0"), hasArrow: true },
  { label: "Find", icon: getIcon("search_file-0"), hasArrow: true },
  { label: "Help", icon: getIcon("help_book_small-0") },
  { label: "Run...", icon: getIcon("application_hourglass_small-0") },
  { type: "separator" },
  { label: "Shut Down...", icon: getIcon("shut_down_normal-0") },
];

const myComputerIcons = [
  { label: "3½ Floppy (A:)", src: getIcon("floppy_drive_3_5-0") },
  { label: "(C:)", src: getIcon("hard_disk_drive-0") },
  { label: "(D:)", src: getIcon("cd_drive-0") },
  { label: "Control Panel", src: getIcon("directory_control_panel-0") },
  { label: "Printers", src: getIcon("printer-0") },
  { label: "Dial-Up Networking", src: getIcon("directory_dial_up_networking-4") },
];

// --- Reusable Components ---

const useDraggable = (initialPosition = { x: 100, y: 50 }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number, startY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      setPosition({
        x: e.clientX - dragRef.current.startX,
        y: e.clientY - dragRef.current.startY,
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position]);

  return { position, handleMouseDown };
};

const W95Border: React.FC<{ children: React.ReactNode; type?: "raised" | "sunken"; className?: string }> = ({ children, type = "raised", className = "" }) => {
  const borderStyle = type === "raised"
    ? "border-t-white border-l-white border-b-gray-800 border-r-gray-800"
    : "border-t-gray-800 border-l-gray-800 border-b-white border-r-white";
  return (
    <div className={`border-2 ${borderStyle} bg-[#c0c0c0] ${className}`}>
      {children}
    </div>
  );
};

const DesktopIcon: React.FC<{ 
  label: string; 
  iconSrc: string; 
  onOpen: () => void; // Called on double click
  isSelected: boolean;
  onSelect: () => void;
}> = ({ label, iconSrc, onOpen, isSelected, onSelect }) => {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onDoubleClick={(e) => { e.stopPropagation(); onOpen(); }}
      className={`flex w-20 flex-col items-center gap-1 cursor-default select-none`}
    >
      <div className="relative p-1">
        <img src={iconSrc} alt={label} className={`h-8 w-8 object-contain ${isSelected ? 'brightness-50' : ''}`} />
        {isSelected && <div className="absolute inset-0 bg-[#000080] mix-blend-color opacity-30"></div>}
      </div>
      <span className={`px-1 text-center text-xs leading-tight ${isSelected ? "bg-[#000080] text-white border border-dotted border-white" : "text-white"}`} style={{ fontFamily: '"MS Sans Serif", sans-serif' }}>
        {label}
      </span>
    </div>
  );
};

const Window: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; initialPos?: {x: number, y: number} }> = ({ title, onClose, children, initialPos }) => {
  const { position, handleMouseDown } = useDraggable(initialPos);

  return (
    <div 
      className="absolute flex flex-col p-1 bg-[#c0c0c0] shadow-md z-40"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()} // Prevent desktop deselect
    >
      <W95Border>
        <div 
          onMouseDown={handleMouseDown}
          className="flex items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] px-1 py-0.5 cursor-move select-none"
        >
          <div className="flex items-center gap-1">
            <img src={getIcon("computer_explorer-0")} alt="" className="h-4 w-4" />
            <span className="text-white font-bold text-sm mr-8">{title}</span>
          </div>
          <div className="flex gap-0.5">
            <W95Border className="w-4 h-4 flex items-center justify-center bg-[#c0c0c0] text-black">-</W95Border>
            <W95Border className="w-4 h-4 flex items-center justify-center bg-[#c0c0c0]">
              <button onClick={onClose} className="w-full h-full flex items-center justify-center text-black">
                  x
              </button>
            </W95Border>
          </div>
        </div>
        <div className="flex gap-2 px-2 py-0.5 text-xs text-black">
          {["File", "Edit", "View", "Help"].map(menu => (
            <span key={menu} className="first-letter:underline cursor-default hover:bg-gray-300 px-1">{menu}</span>
          ))}
        </div>
        <W95Border type="sunken" className="bg-white m-1 p-4 min-h-[200px] min-w-[350px] overflow-auto">
          {children}
        </W95Border>
        <W95Border type="sunken" className="mx-1 mb-1 px-2 py-0.5 text-xs text-black flex gap-4">
            <span className="flex-1">6 object(s)</span>
         </W95Border>
      </W95Border>
    </div>
  );
};

// --- Main Page Component ---

export const DesktopPage: React.FC = () => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleOpenWindow = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
    setIsStartOpen(false);
  };

  const closeWindow = (id: string) => {
    setOpenWindows(openWindows.filter(winId => winId !== id));
  };

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-[#008080]"
      style={{ fontFamily: '"MS Sans Serif", Arial, sans-serif' }}
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => {
        setIsStartOpen(false);
        setSelectedIcon(null);
      }}
    >
      {/* Desktop Icons */}
      <div className="flex h-full flex-col flex-wrap content-start items-start gap-4 p-4">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            label={icon.label}
            iconSrc={icon.src}
            isSelected={selectedIcon === icon.id}
            onSelect={() => setSelectedIcon(icon.id)}
            onOpen={() => handleOpenWindow(icon.id)}
          />
        ))}
      </div>

      {/* Windows */}
      {openWindows.includes("my-computer") && (
        <Window title="My Computer" onClose={() => closeWindow("my-computer")} initialPos={{x: 150, y: 50}}>
          <div className="flex flex-wrap gap-6">
            {myComputerIcons.map((icon, idx) => (
              <div key={idx} className="flex flex-col items-center w-16 gap-1 cursor-default group">
                <img src={icon.src} alt={icon.label} className="h-8 w-8" />
                <span className="text-[10px] text-center leading-tight text-black">{icon.label}</span>
              </div>
            ))}
          </div>
        </Window>
      )}

      {/* Start Menu */}
      {isStartOpen && (
        <div onClick={(e) => e.stopPropagation()}>
           <StartMenu />
        </div>
      )}

      {/* Taskbar */}
      <TaskBar 
        isStartOpen={isStartOpen} 
        onToggleStart={() => setIsStartOpen(!isStartOpen)} 
        openWindows={openWindows}
      />
    </div>
  );
};

// --- Sub-components for Taskbar/Start ---

const StartMenu: React.FC = () => (
    <W95Border className="absolute bottom-[28px] left-0 flex h-[300px] z-50 shadow-md">
      <div className="w-6 bg-gray-500 relative overflow-hidden flex items-end justify-center">
        <span className="text-lg font-bold text-white -rotate-90 whitespace-nowrap origin-bottom-left absolute bottom-2 left-5 tracking-tighter">
          <span className="text-gray-300">Windows</span>95
        </span>
      </div>
      <div className="flex-1 flex flex-col py-1 bg-[#c0c0c0] min-w-[160px]">
        {startMenuItems.map((item, index) => (
          item.type === "separator" ? 
            <div key={index} className="border-t border-t-gray-600 border-b border-b-white my-1 mx-1" /> :
            <div key={index} className="flex items-center px-2 py-1 hover:bg-[#000080] hover:text-white cursor-default text-sm">
              <img src={item.icon} alt="" className="h-6 w-6 mr-2" />
              <span className="flex-1">{item.label}</span>
            </div>
        ))}
      </div>
    </W95Border>
);

const TaskBar: React.FC<{ isStartOpen: boolean; onToggleStart: () => void; openWindows: string[] }> = ({ isStartOpen, onToggleStart, openWindows }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 flex h-[28px] items-center justify-between bg-[#c0c0c0] border-t-2 border-white px-1 z-50">
      <div className="flex gap-1 h-full py-0.5">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleStart(); }}
          className="outline-none"
        >
          <W95Border type={isStartOpen ? "sunken" : "raised"} className="px-1 flex items-center gap-1 font-bold text-xs h-full text-black">
            <img src={getIcon("windows-0")} alt="win" className="h-4 w-4" />
            Start
          </W95Border>
        </button>
        {openWindows.map(id => (
            <W95Border key={id} type="sunken" className="px-2 flex items-center gap-1 text-xs min-w-[100px] bg-[#d0d0d0] font-bold text-black">
              <img src={getIcon("computer_explorer-0")} alt="" className="h-3 w-3" />
              <span>My Computer</span>
            </W95Border>
        ))}
      </div>
      <W95Border type="sunken" className="flex items-center gap-2 px-2 h-[20px] mb-0.5">
        <img src={getIcon("loudspeaker_rays-0")} className="h-3 w-3" alt="vol" />
        <span className="text-[10px] text-black">{time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
      </W95Border>
    </div>
  );
};