import * as PIXI from 'pixi.js';
import { useEffect, useRef } from 'react';

const VideoTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const times = [
    0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 1.0, 2.0, 3.0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18,
    0.21, 1.0, 2.0, 3.0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 1.0, 2.0, 3.0,
  ];

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // PixiJS アプリケーションの作成
    const app = new PIXI.Application({
      width: 300 * times.length,
      height: 168,
      backgroundColor: 0x1099bb,
    });

    containerRef.current.appendChild(app.view as unknown as Node);

    // 動画要素の作成
    const video = document.createElement('video');
    video.src = '/video/tooyama_crouch.mov';
    video.muted = true;
    video.load();

    video.onloadeddata = async () => {
      const textures = [];

      for (let i = 0; i < times.length; i++) {
        const time = times[i];

        // video.onseeked イベントリスナーを定義
        await new Promise((resolve) => {
          video.onseeked = () => {
            PIXI.utils.clearTextureCache();
            const texture = PIXI.Texture.from(video, { scaleMode: PIXI.SCALE_MODES.NEAREST });
            textures.push(texture);
            const sprite = new PIXI.Sprite(texture);
            sprite.x = i * 300;
            sprite.width = 300;
            sprite.height = 168;
            app.stage.addChild(sprite);

            resolve(null);
          };

          video.currentTime = time;
        });
      }
    };
    return () => {
      app.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          overflowX: 'scroll',
          whiteSpace: 'nowrap',
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  );
};

export default VideoTimeline;
