import { Button, Center, Flex, Group } from '@mantine/core';
import type { FC } from 'react';
import { Image } from 'react-konva';

import { GroupLayer, Markers, Stage, StickPicture } from '@/components/Canvas';
import { useAnnotation, useCanvasOperation, useFrameSize } from '@/hooks';
import { useMarker, useMarkerSetting } from '@/store';
import type { Frame, MarkerSetting } from '@/types';

type Props = {
  labelingMode: string;
  stageSize: { width: number; height: number };
  selectedFrame: Frame;
  selectedCanvas: HTMLCanvasElement;
};

const AnnotationCanvas: FC<Props> = ({
  labelingMode,
  stageSize,
  selectedFrame,
  selectedCanvas,
}) => {
  const { markers } = useMarker();
  const { options, radius, opacity } = useMarkerSetting();
  const { frameSize, positionScale } = useFrameSize(stageSize, selectedFrame);

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
  } = useAnnotation();

  return (
    <Flex direction='column' h='100%'>
      <Center className='flex-1'>
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
              image={selectedCanvas}
              onMouseUp={(e) => handleMouseUpImage(e, positionScale, labelingMode)}
              onMouseDown={handleMouseDownImage}
              alt=''
            />
            {markers && markers.length > 0 ? (
              <>
                <StickPicture markers={markers} positionScale={positionScale} />
                <Markers
                  circleRef={circleRef}
                  markers={markers}
                  markerSetting={{ options, radius, opacity } as MarkerSetting}
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
        <Group spacing='sm' position='center'>
          <Button variant='default' onClick={handleFitImage}>
            Fit
          </Button>
        </Group>
      </Center>
    </Flex>
  );
};

export default AnnotationCanvas;
