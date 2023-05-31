import { Button, Center, Flex, Group } from '@mantine/core';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import { Circle, Image } from 'react-konva';

import {
  CalibrationInput,
  CalibrationStick,
  GroupLayer,
  Markers,
  Stage,
} from '@/components/Canvas';
import { defaultCalibrationMarkerOption } from '@/constant';
import {
  useCalibration,
  useCanvasOperation,
  useFrameSize,
  useOpenCV,
  usePanningCalibration,
} from '@/hooks';
import { useCalibrationMarker, useEditorMode, useMarkerSetting } from '@/store';
import type { Dimensions, Frame, MarkerSetting } from '@/types';

type Props = {
  stageSize: Dimensions;
  frame: Frame;
  canvas: HTMLCanvasElement;
};

const CalibrationCanvas: FC<Props> = ({ stageSize, frame, canvas }) => {
  const { markers } = useCalibrationMarker();
  const { radius, opacity } = useMarkerSetting();
  const { calibrationMode } = useEditorMode();
  const { frameSize, positionScale } = useFrameSize(stageSize, frame);
  const { cv } = useOpenCV();
  const { processedImage, processImage } = usePanningCalibration(canvas, cv);

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

  const imageRef2 = useRef<Konva.Image>(null);
  const [selectedColor, setSelectedColor] = useState<[number, number, number]>([0, 0, 0]);

  const handleImageClick = (e: KonvaEventObject<MouseEvent>) => {
    const x = Math.round(e.target.getRelativePointerPosition().x);
    const y = Math.round(e.target.getRelativePointerPosition().y);

    const canvas = imageRef2.current?.toCanvas();
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    processImage(imageData[0]);

    setSelectedColor([imageData[0], imageData[1], imageData[2]]);
  };

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
            {calibrationMode === 'static' ? (
              <Image
                ref={imageRef}
                width={frameSize.width}
                height={frameSize.height}
                image={canvas}
                onMouseUp={(e) => handleMouseUpImage(e, positionScale)}
                onMouseDown={handleMouseDownImage}
                alt=''
              />
            ) : null}
            {calibrationMode === 'panningWithMarkers' ? (
              <Image
                ref={imageRef2}
                width={frameSize.width}
                height={frameSize.height}
                image={canvas}
                onMouseUp={handleImageClick}
                onMouseDown={handleMouseDownImage}
                alt=''
              />
            ) : null}
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
            <Circle
              x={15}
              y={15}
              radius={10}
              fill={`rgb(${selectedColor[0]}, ${selectedColor[1]}, ${selectedColor[2]})`}
            />
          </GroupLayer>
        </Stage>
      </Center>
      <canvas ref={processedImage} width={300} height={180} />
      <Center h={80}>
        <Group spacing='sm'>
          <Button variant='default' onClick={() => processImage(selectedColor[0])}>
            マーカー取得
          </Button>
          <Button variant='default' onClick={handleFitImage}>
            Fit
          </Button>
          {calibrationMode === 'static' ? <CalibrationInput /> : null}
          {/* マーカーの色選択, 競技場の色選択 */}
          {/* {calibrationMode === 'panningWithMarkers' ? <>hello</> : null} */}
        </Group>
      </Center>
    </Flex>
  );
};

export default CalibrationCanvas;
