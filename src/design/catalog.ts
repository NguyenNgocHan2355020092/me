import source from './frames.json';

export const startFrameId = source.flowStart.nodeId;
export const screens = source.frames;
export type ScreenDefinition = typeof screens[number];
export type FrameProps = {
  screen: ScreenDefinition;
  onHotspot: (nodeId: string) => void;
};

export function findScreen(id: string) {
  return screens.find(screen => screen.id === id);
}
