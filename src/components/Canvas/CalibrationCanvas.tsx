import { Button, Center, Flex, Group } from '@mantine/core';
import type { FC } from 'react';
import { Image } from 'react-konva';

import {
  CalibrationInput,
  CalibrationStick,
  GroupLayer,
  Markers,
  Stage,
} from '@/components/Canvas';
import { defaultCalibrationMarkerOption } from '@/constant';
import { useCalibration, useCanvasOperation, useFrameSize } from '@/hooks';
import { useCalibrationMarker, useMarkerSetting } from '@/store';
import type { Dimensions, Frame, MarkerSetting } from '@/types';

type Props = {
  stageSize: Dimensions;
  frame: Frame;
  canvas: HTMLCanvasElement;
};

const CalibrationCanvas: FC<Props> = ({ stageSize, frame, canvas }) => {
  const { markers } = useCalibrationMarker();
  const { radius, opacity } = useMarkerSetting();
  const { frameSize, positionScale } = useFrameSize(stageSize, frame);

  const {
    stageRef,
    groupRef,
    imageRef,
    circleRef,
    handleZoom,
    handleFitImage,
    handleDragEndGroup,
  } = useCanvasOperation(stageSize, frameSize);

  const {
    isDraggable,
    handleMouseDownImage,
    handleMouseUpImage,
    handleHoverCircle,
    handleRightClick,
    handleDoubleTapCircle,
    handleDragStartCircle,
    handleDragEndCircle,
  } = useCalibration();

  return (
    <Flex direction='column' h='100%'>
      <Center className='relative flex-1'>
        <Stage stageRef={stageRef} stageSize={stageSize}>
          <GroupLayer
            groupRef={groupRef}
            markers={markers}
            isDraggable={isDraggable}
            frameSize={frameSize}
            onZoom={handleZoom}
            onDragEndGroup={handleDragEndGroup}
          >
            <Image
              ref={imageRef}
              width={frameSize.width}
              height={frameSize.height}
              image={canvas}
              onMouseUp={(e) => handleMouseUpImage(e, positionScale)}
              onMouseDown={handleMouseDownImage}
              alt=''
            />
            <CalibrationStick markers={markers} positionScale={positionScale} />
            {markers && markers.length > 0 ? (
              <>
                <Markers
                  circleRef={circleRef}
                  markers={markers}
                  markerSetting={
                    { options: defaultCalibrationMarkerOption, radius, opacity } as MarkerSetting
                  }
                  positionScale={positionScale}
                  onRightClick={handleRightClick}
                  onDoubleTapCircle={handleDoubleTapCircle}
                  onHoverCursor={handleHoverCircle}
                  onDragStart={handleDragStartCircle}
                  onDragEnd={handleDragEndCircle}
                />
              </>
            ) : null}
          </GroupLayer>
        </Stage>
      </Center>
      <Center h={80}>
        <Group spacing='sm'>
          <Button variant='default' onClick={handleFitImage}>
            Fit
          </Button>
          <CalibrationInput />
        </Group>
      </Center>
    </Flex>
  );
};

export default CalibrationCanvas;
