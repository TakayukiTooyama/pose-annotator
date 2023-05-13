import { Container, Graphics, Sprite, Stage, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import type { FC } from 'react';
import { Fragment, useCallback, useEffect, useRef } from 'react';

import { useDarkMode } from '@/hooks';
import { useFrame, useScrollViewport } from '@/store';
import type { Frame } from '@/types';

type Props = {
  frames: Frame[];
  canvases: HTMLCanvasElement[];
};

const HEIGHT = 128;
const WIDTH = 128 * (16 / 9);
const PADDING = 5;
const FONTSIZE = 12;
const LINE_THICKNESS = 2;

const calculateTextWidth = (text: string) => text.length * PADDING + FONTSIZE + PADDING * 2;

export const FrameList: FC<Props> = ({ frames, canvases }) => {
  const frameListViewport = useRef<HTMLDivElement>(null);
  const { setFrameListViewport } = useScrollViewport();
  const { currentFrameIndex, selectFrameIndex } = useFrame();
  const { colorScheme } = useDarkMode();
  const dark = colorScheme === 'dark';

  useEffect(() => {
    setFrameListViewport(frameListViewport.current);
  }, [setFrameListViewport]);

  const redBorderDraw = useCallback(
    (g: PIXI.Graphics, index: number) => {
      g.clear();
      g.beginFill(0x000000, 0.5);
      g.drawRect(
        index * WIDTH + LINE_THICKNESS,
        LINE_THICKNESS,
        calculateTextWidth(frames?.[index].name),
        FONTSIZE * 2,
      );
      g.endFill();
    },
    [frames],
  );

  const frameNumberDraw = useCallback((g: PIXI.Graphics, index: number) => {
    g.clear();
    g.lineStyle(LINE_THICKNESS + 1, 0xff0000, 1, 0);
    g.drawRect(index * WIDTH, 0, WIDTH, HEIGHT);
  }, []);

  const backgroundDraw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(dark ? 0x111111 : 0xffffff);
      g.drawRect(0, 0, frameListViewport.current?.clientWidth || 1080, HEIGHT);
      g.endFill();
    },
    [dark, frameListViewport],
  );

  return (
    <div
      className='relative h-32  cursor-pointer overflow-x-auto overflow-y-hidden'
      ref={frameListViewport}
    >
      <Stage
        width={frameListViewport.current?.clientWidth}
        height={HEIGHT}
        options={{ backgroundColor: dark ? 0x111111 : 0xffffff }}
      >
        <Graphics draw={backgroundDraw} />
        <Container
          x={
            -(currentFrameIndex * WIDTH) +
            (frameListViewport.current?.clientWidth || 0) / 2 -
            WIDTH / 2
          }
        >
          <Graphics draw={backgroundDraw} x={-WIDTH} />
          {canvases.map((canvas, index) => (
            <Fragment key={index}>
              <Sprite
                texture={PIXI.Texture.from(canvas)}
                x={index * WIDTH}
                eventMode='static'
                pointerdown={() => selectFrameIndex(index)}
                width={WIDTH}
                height={HEIGHT}
                data-index='data-index'
              />
              <Graphics draw={(g) => redBorderDraw(g, index)} />
              <Text
                text={frames?.[index].name}
                anchor={new PIXI.Point(0.5, 0.5)}
                x={index * WIDTH + LINE_THICKNESS + calculateTextWidth(frames[index].name) / 2}
                y={FONTSIZE + LINE_THICKNESS}
                style={
                  new PIXI.TextStyle({
                    fill: 'white',
                    fontSize: FONTSIZE,
                  })
                }
              />
              {currentFrameIndex === index && <Graphics draw={(g) => frameNumberDraw(g, index)} />}
            </Fragment>
          ))}
          <Graphics draw={backgroundDraw} x={(canvases.length + 1) * WIDTH} />
        </Container>
      </Stage>
    </div>
  );
};
