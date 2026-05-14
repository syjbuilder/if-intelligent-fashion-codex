# I.F 광고 영상 제작 계획 v0.3a — If, everywhere

작성일: 2026-05-13
연결 문서: `기획/I.F V0 PRD.md`, `문서_모두의 창업/모두의창업_지원서_기획_v0.3.md`, `디자인/레퍼런스/레퍼런스_화면녹화2.mp4`
작성 의도: 사람·서사·설명을 모두 빼고, "if"라는 단어가 일상 곳곳에 이미 박혀 있는 모습만 보여주는 **브랜드 임프린트형 광고**. 보는 사람에게 즉답을 주지 않고 여운과 호기심을 남기는 방향. 인스타·쓰레드 등 "이 브랜드 뭐지?"를 만들어야 하는 채널에 최적화.

---

## 1. 한 줄 콘셉트

> **If is already in your world.**
>
> 당신의 세계 어딘가에는, 이미 if가 있다.

## 2. 메시지 구조

I.F.의 본질은 가능성("if")이다. *Wear what you imagine* — 상상한 모든 것이 옷이 될 수 있다는 약속. 이 약속을 설명하지 않고, 마치 **이미 세상에 스며 있는 단어인 것처럼** 일상 사물 곳곳에 박아 보여준다. 보는 사람은 영상이 끝난 뒤 1~2초 동안 "if = 가능성 = 상상 = 옷"의 연결을 머릿속에서 직접 만든다. 그 빈틈이 광고의 여운이다.

## 3. 핵심 원칙

- **사람을 정면으로 보여주지 않는다.** 손, 뒷모습, 실루엣까지만 허용.
- **"if"는 항상 소문자로, 작게, 은밀하게** 박혀 있다.
- **컷 안에 어떤 카피도 띄우지 않는다.** 텍스트는 마지막 1.5초에만.
- **사운드는 거의 무음**에 가까운 도시·자연 앰비언트, 마지막 1초에만 단단한 저음 한 번.
- 의류·UI·로고가 영상 본문에 등장하지 않는다.

## 4. 포맷 / 러닝타임

- **9:16 세로** (1080×1920) — 인스타 릴스, 쓰레드, 유튜브 쇼츠
- **총 15초** = 5 컷 × 2.5초 + 엔드 카드 2.5초
- 가로(16:9) 컷다운은 만들지 않음. 세로 전용 영상.

## 5. 컷 구조

```text
00:00 – 02:30   Cut 1  카페 라떼 거품 위 손가락이 if 모양을 그린다
02:30 – 05:00   Cut 2  옷장 안 옷걸이 사이로 들어오는 햇빛이 if 그림자를 만든다
05:00 – 07:30   Cut 3  도시 콘크리트 벽에 흘려 쓴 if 그래피티, 행인 그림자가 스친다
07:30 – 10:00   Cut 4  비 온 뒤 도시 유리창, 김이 서리고 누군가 손가락으로 if를 쓴다
10:00 – 12:30   Cut 5  흰 운동화 끈 끝에 묶인 작은 가죽 태그, if가 양각으로 박혀 있다
12:30 – 15:00   End    검은 화면 + 흰 I.F. 마크 + "Wear what you imagine."
```

## 6. 필요한 키이미지

```text
01_latte_if.png
02_closet_shadow_if.png
03_graffiti_if.png
04_window_fog_if.png
05_sneaker_tag_if.png
06_brand_end.png  (직접 디자인 권장, AI 생성 비권장)
```

`06_brand_end.png`는 검정 배경에 흰 *I.F.* 마크 + 한 줄 카피만 들어가는 정적 카드. 텍스트 정확도가 중요하므로 Figma·Photoshop으로 직접 만들고 AI 이미지 생성은 사용하지 않는다.

## 7. 공통 스타일 프롬프트

모든 키이미지 프롬프트 끝에 붙인다.

```text
cinematic, 35mm lens, natural light, shallow depth of field, hyper-realistic texture, vertical 9:16 framing, premium minimal mood, no text overlay, no watermark, no logo, the lowercase letters "if" must be readable but subtle and integrated into the surface, no extra letters, no random typography
```

네거티브:

```text
cartoon, anime, 3D render look, plastic surface, neon overlay, ad banner, product packaging, watermark, logo, random letters, broken typography, distorted text, extra characters, glitch
```

## 8. 키이미지 생성 프롬프트 (통합본 — 그대로 복사)

### Cut 1. Latte if

```text
Top-down macro close-up of a small ceramic espresso cup filled with fresh latte, the micro-foam art on the surface forming the lowercase letters "if" in clean delicate strokes, one warm-skinned hand cradling the cup at the lower edge of frame, soft warm cafe morning light, wooden table surface slightly visible, cinematic, 35mm lens, natural light, shallow depth of field, hyper-realistic texture, vertical 9:16 framing, premium minimal mood, no text overlay, no watermark, no logo, the lowercase letters "if" must be readable but subtle and integrated into the surface, no extra letters, no random typography.

Negative prompt: cartoon, anime, 3D render look, plastic surface, neon overlay, ad banner, product packaging, watermark, logo, random letters, broken typography, distorted text, extra characters, glitch.
```

### Cut 2. Closet shadow if

```text
Close-up of the interior of an open wooden wardrobe at home, hanging clothes blurred in the background, a single beam of soft morning sunlight cutting through the gap between two hangers, the shadow on the back wall forming the clean lowercase letters "if", fine dust particles drifting in the light, calm quiet mood, cinematic, 35mm lens, natural light, shallow depth of field, hyper-realistic texture, vertical 9:16 framing, premium minimal mood, no text overlay, no watermark, no logo, the lowercase letters "if" must be readable but subtle and integrated into the surface, no extra letters, no random typography.

Negative prompt: cartoon, anime, 3D render look, plastic surface, neon overlay, ad banner, product packaging, watermark, logo, random letters, broken typography, distorted text, extra characters, glitch.
```

### Cut 3. Graffiti if

```text
Close-up of a weathered concrete wall on a Seoul backstreet, casual lowercase "if" graffiti tag drawn with a black marker, slightly faded, the blurred silhouette of a pedestrian passing in the background, soft afternoon light, cinematic, 35mm lens, natural light, shallow depth of field, hyper-realistic texture, vertical 9:16 framing, premium minimal mood, no text overlay, no watermark, no logo, the lowercase letters "if" must be readable but subtle and integrated into the surface, no extra letters, no random typography.

Negative prompt: cartoon, anime, 3D render look, plastic surface, neon overlay, ad banner, product packaging, watermark, logo, random letters, broken typography, distorted text, extra characters, glitch.
```

### Cut 4. Window fog if

```text
Close-up of a fogged-up urban window after rain at evening, a fingertip just having finished drawing the lowercase letters "if" through the misted glass, soft blurred neon lights and city signage beyond the window, water droplets near the bottom edge, intimate quiet mood, cinematic, 35mm lens, natural light, shallow depth of field, hyper-realistic texture, vertical 9:16 framing, premium minimal mood, no text overlay, no watermark, no logo, the lowercase letters "if" must be readable but subtle and integrated into the surface, no extra letters, no random typography.

Negative prompt: cartoon, anime, 3D render look, plastic surface, neon overlay, ad banner, product packaging, watermark, logo, random letters, broken typography, distorted text, extra characters, glitch.
```

### Cut 5. Sneaker tag if

```text
Macro close-up of clean white sneaker laces on dark asphalt, a small natural leather tag tied to one lace end, the lowercase letters "if" embossed deeply into the leather surface, fine grain texture visible, soft daylight, cinematic, 35mm lens, natural light, shallow depth of field, hyper-realistic texture, vertical 9:16 framing, premium minimal mood, no text overlay, no watermark, no logo, the lowercase letters "if" must be readable but subtle and integrated into the surface, no extra letters, no random typography.

Negative prompt: cartoon, anime, 3D render look, plastic surface, neon overlay, ad banner, product packaging, watermark, logo, random letters, broken typography, distorted text, extra characters, glitch.
```

## 9. Image-to-Video 프롬프트

각 키이미지에 아래 프롬프트를 붙여 2.5초 클립을 생성한다.

### Clip 1 (Latte)

```text
Create a 2.5-second cinematic vertical 9:16 shot. The hand holds the cup steady, very subtle steam rising from the surface, the camera slowly pushes in toward the foam art. The lowercase "if" must remain crisp and unchanged through the entire shot. No text overlay, no logo, no random letters, no morphing of the foam shape.
```

### Clip 2 (Closet shadow)

```text
Create a 2.5-second cinematic vertical 9:16 shot. The shadow gradually sharpens as the morning light strengthens, dust particles drift slowly across the beam of light. The lowercase "if" shadow must remain readable and stable. No camera movement, no text overlay, no logo, no extra letters.
```

### Clip 3 (Graffiti)

```text
Create a 2.5-second cinematic vertical 9:16 shot. A pedestrian's blurred silhouette walks across the background once, the wall stays in sharp focus. The lowercase "if" tag must remain crisp. No camera movement, no text overlay, no logo, no extra letters, no graffiti changing shape.
```

### Clip 4 (Window fog)

```text
Create a 2.5-second cinematic vertical 9:16 shot. The fingertip finishes the last stroke of "if" and pulls back, water droplet rolls slowly down the glass below the letters. Neon lights beyond the window pulse subtly. The lowercase "if" must stay readable until the end. No text overlay, no logo, no extra letters.
```

### Clip 5 (Sneaker tag)

```text
Create a 2.5-second cinematic vertical 9:16 shot. The camera makes a very slow push-in toward the embossed "if" on the leather tag, the laces gently shift as if the wearer just took a step. The lowercase "if" must stay crisp throughout. No text overlay, no logo, no extra letters.
```

## 10. Prompt-Only 통합 단일 프롬프트 (15초 한 번에)

영상 툴이 긴 영상을 한 번에 생성할 수 있는 경우 사용.

```text
Create a 15-second cinematic brand film in vertical 9:16 format for a fashion brand called I.F. The film must contain no human faces, no on-screen text overlays during the body of the film, and no product shots. The visual concept is "the lowercase word 'if' is already in everyday surfaces". Show five connected cuts, each 2.5 seconds, with subtle natural movement only.

Cut 1 (0:00–0:02.5): top-down close-up of a fresh latte in a small ceramic cup, foam art forming the lowercase letters "if", a hand cradling the cup, warm cafe morning light, slow push-in.

Cut 2 (0:02.5–0:05): inside an open wooden wardrobe, soft morning sunlight cutting through the gap between hangers, the shadow on the back wall forming the lowercase letters "if", drifting dust particles, no camera movement.

Cut 3 (0:05–0:07.5): close-up of a weathered Seoul concrete wall, casual lowercase "if" graffiti tag in black marker, a blurred pedestrian silhouette walks across the background once, no camera movement.

Cut 4 (0:07.5–0:10): close-up of a fogged-up urban window after rain at evening, a fingertip finishes drawing the lowercase letters "if" through the mist, soft blurred neon lights beyond, a water droplet rolls down below the letters.

Cut 5 (0:10–0:12.5): macro close-up of a clean white sneaker lace, a small leather tag tied to the lace end with the lowercase letters "if" embossed into it, slow push-in.

End card (0:12.5–0:15): pure black background, white I.F. wordmark in the center, white sans-serif line below: "Wear what you imagine." Hold static.

Premium minimal mood throughout, cinematic 35mm look, natural light, shallow depth of field, hyper-realistic texture, no text overlays in cuts 1 to 5, no watermark, no random letters, no glitch, no face change, the lowercase "if" in each cut must remain readable and stable.
```

## 11. 편집 타임라인

```text
00:00 – 02:30   Cut 1   slow push-in,  ambient cafe sound
02:30 – 05:00   Cut 2   static,        room silence + dust ambience
05:00 – 07:30   Cut 3   static,        distant city traffic
07:30 – 10:00   Cut 4   subtle pull,   end-of-rain ambience
10:00 – 12:30   Cut 5   slow push-in,  faint single footstep
12:30 – 13:30   Black fade in
13:30 – 14:50   I.F. wordmark + "Wear what you imagine." fade in
14:50 – 15:00   Single deep low-end note + cut to silence
```

컷 전환은 모두 0.3초 이내 cross-dissolve. 하드컷은 사용하지 않는다(여운 유지).

## 12. 사운드 디자인

- 0.0–11.2s: 환경음만 — 커피머신 잔향, 옷장 정적, 거리 잡음, 빗방울 끝, 발걸음 한 번
- 11.2–12.8s: 모든 환경음을 빠르게 페이드 아웃
- 12.8–15.0s: 단 한 번의 단단한 저음(서브 베이스), 그 후 정적

음악은 사용하지 않는다. 음악이 들어가는 순간 광고가 "느껴지기" 시작하고 여운이 깨진다.

## 13. UI 노출

**0%.** 이 영상에는 I.F.의 UI, 스마트폰 화면, 앱 인터페이스가 등장하지 않는다.

## 14. 채널 매핑

| 채널 | 적합도 | 비고 |
|---|---|---|
| 인스타그램 릴스 | ★★★★★ | 호기심·여운 채널에 정확히 맞음 |
| 쓰레드 (영상 첨부) | ★★★★★ | "이게 뭐지?"를 만드는 데 최적 |
| 유튜브 쇼츠 | ★★★★ | 자동재생 환경에서 끝까지 보게 됨 |
| 모두의창업 Q8 영상 | ★★ | 서비스 설명력이 0이라 권장도 낮음 — Plan B를 별도 제작 권장 |
| 웹 랜딩 히어로 | ★★ | 9:16이라 데스크톱에서는 어색 — Plan B의 16:9 버전 사용 |

## 15. 품질 체크리스트

- [ ] 각 컷에서 "if"가 한 번에 인식되는가?
- [ ] 사람의 얼굴이 노출되지 않았는가?
- [ ] 영상 본문(0~12.5초)에 어떤 텍스트도 띄우지 않았는가?
- [ ] 마지막 1.5초에만 브랜드와 카피가 등장하는가?
- [ ] 음악이 들어가지 않았는가?
- [ ] 첫 시청에서 "이게 무슨 광고지?"라는 호기심이 생기는가?
- [ ] 두 번째 시청에서 "if = 가능성"의 연결이 떠오르는가?
- [ ] 영상 안에 옷이나 UI가 등장하지 않았는가?

## 16. 최종 판단

이 광고는 **서비스를 설명하지 않는다.** 그것이 약점이자 강점이다. 보는 사람의 머릿속에 "I.F."라는 이름과 "if"라는 단어, 그리고 "어딘가 이미 존재하는 가능성"이라는 분위기만 남긴다. 첫 인스타·쓰레드 노출에서 가장 강한 무기는 **여백**이다.

서비스를 정확히 이해시켜야 하는 자리(모두의창업 영상, 웹 랜딩 히어로)에는 같은 폴더의 **v0.3b — Mind to Street**를 사용한다.
