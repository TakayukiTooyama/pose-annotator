import { Container, Graphics, Sprite, Stage } from '@pixi/react';
import * as PIXI from 'pixi.js';
import type { FC } from 'react';
import { Fragment } from 'react';

type Props = {
  viewportRef: React.RefObject<HTMLDivElement>;
  currentFrameIndex: number;
  canvases: HTMLCanvasElement[];
  onSelectFrame: (index: number, isScroll: boolean) => void;
};

export const FrameList2: FC<Props> = ({
  viewportRef,
  currentFrameIndex,
  canvases,
  onSelectFrame,
}) => {
  const height = 128;
  const width = 128 * (16 / 9);
  return (
    <div
      className='relative h-32 w-full cursor-pointer overflow-x-auto overflow-y-hidden'
      ref={viewportRef}
    >
      <Stage width={canvases.length * width} height={height}>
        <Container>
          {canvases.map((canvas, index) => (
            <Fragment key={index}>
              <Sprite
                texture={PIXI.Texture.from(canvas)}
                x={index * width}
                eventMode='static'
                pointerdown={() => onSelectFrame(index, true)}
                width={width}
                height={height}
              />
              {currentFrameIndex === index && (
                <Graphics
                  draw={(graphics) => {
                    graphics.lineStyle(3, 0xff0000, 1, 0);
                    graphics.drawRect(index * width, 0, width, height);
                  }}
                />
              )}
            </Fragment>
          ))}
        </Container>
      </Stage>
    </div>
  );
};
