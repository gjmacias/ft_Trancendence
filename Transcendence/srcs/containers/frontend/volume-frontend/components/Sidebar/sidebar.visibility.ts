import { getSidebar }  from './sidebar';

let sidebarEnabled = true;

export default function toggleSidebar(enabled?: boolean): void {
  if (enabled !== undefined) {
    if (enabled === true) {
      showSidebar();
      sidebarEnabled = true;
    } else {
      hideSidebar();
      sidebarEnabled = false;
    }
    return;
  }
  if (sidebarEnabled === true) {
    hideSidebar();
  } else {
    showSidebar();
  }
  sidebarEnabled = !sidebarEnabled;
}

export function hideSidebar(): void {
  const sidebar = getSidebar();
  sidebar.style.display = 'none';
}

export function showSidebar(): void {
  const sidebar = getSidebar();
  sidebar.style.display = 'block';
}
