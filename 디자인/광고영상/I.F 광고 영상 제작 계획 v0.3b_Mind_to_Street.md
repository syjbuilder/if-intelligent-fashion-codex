# I.F 광고 영상 제작 계획 v0.3b — Mind to Street

작성일: 2026-05-13
연결 문서: `기획/I.F V0 PRD.md`, `기획/If discovery summary.md`, `문서_모두의 창업/모두의창업_지원서_기획_v0.3.md`
작성 의도: 서비스 메커니즘을 한 영상 안에 시각적으로 압축한다. **상상(텍스트) → AI 룩 형성 → 실제 옷 → 실제 거리**의 흐름이 한 호흡으로 이어진다. 모두의창업 심사위원과 첫 사용자가 12초 안에 "이 서비스가 무엇을 하는지" 이해할 수 있어야 한다.

---

## 1. 한 줄 콘셉트

> **Imagined. Rendered. Worn.**
>
> 상상하면, 그려지고, 입는다.

## 2. 메시지 구조

I.F.의 약속은 **"네가 말하는 옷을, 진짜로 입을 수 있다"**이다. 이를 설명이 아니라 **변환(morph)**으로 보여준다. 단어가 빛으로, 빛이 옷의 윤곽으로, 윤곽이 패브릭으로, 패브릭이 사람에게, 사람이 거리로 — 다섯 단계의 시각적 변환이 끊기지 않고 한 호흡으로 흐른다. 보는 사람은 광고가 끝나기 전에 이미 *"아, 이건 말로 옷을 찾는 서비스"*라고 직관적으로 안다.

## 3. 핵심 원칙

- **3 Act, 1 Body.** 입력(Thought) → 형성(Render) → 입기(Wear)가 한 인물의 한 호흡 안에서 일어난다.
- **변환은 마법이 아니라 정교한 시각화.** 빛이 깜빡이거나 옷이 휘날리며 갑자기 나타나는 식의 판타지는 금지. 빛 입자 → 윤곽선 → 패브릭 → 실물의 단계가 모두 보여야 한다.
- **인물의 얼굴은 마지막 6초에만 등장한다.** Act 1·2는 손·실루엣·뒷모습.
- **UI는 0.5초 이내로 한 번만** 노출 (Act 1 첫머리).
- 사운드와 영상의 비트가 정확히 맞아야 한다 — Type · Render · Step.

## 4. 포맷 / 러닝타임

- **9:16 세로 18초** (1080×1920) — 인스타·쓰레드·쇼츠·모두의창업 Q8
- **16:9 가로 16초** 컷다운 별도 제작 — 웹 랜딩 히어로용

## 5. 컷 구조 (Act 단위)

```text
ACT 1 — The Thought  (0:00 – 0:06)
00:00 – 00:02   손가락이 스마트폰에 단어를 친다 — "꾸안꾸 데이트룩"
00:02 – 00:04   글자가 화면 밖으로 빛 입자처럼 흘러나온다
00:04 – 00:06   빛 입자가 검은 허공에 응축, 옷의 윤곽선이 희미하게 그려진다

ACT 2 — The Render  (0:06 – 0:12)
00:06 – 00:08   윤곽선에 패브릭 텍스처가 채워진다 (니트, 코튼, 데님이 차례로)
00:08 – 00:10   옷이 보이지 않는 사람의 어깨·허리·다리에 빠르게 감긴다
00:10 – 00:12   마지막 단추, 마지막 자락이 자리를 잡는다 (실물 디테일 클로즈업)

ACT 3 — The Wear  (0:12 – 0:18)
00:12 – 00:15   카메라 줌아웃, 그 옷을 입은 사람이 도시 거리로 첫 발을 내딛는다
00:15 – 00:16.5 옆모습 한 컷, 자연스러운 걸음, 거리 빛이 옷에 닿는다
00:16.5 – 00:18 검은 화면 + 흰 I.F. 마크 + "Wear what you imagine."
```

## 6. 필요한 키이미지

```text
01_typing_thought.png    스마트폰 입력 + 글자가 빛으로 흩어지는 순간
02_outline_form.png      빛 입자가 옷 윤곽선으로 응축되는 순간
03_fabric_render.png     윤곽선이 패브릭으로 채워지는 클로즈업
04_dress_complete.png    옷이 사람에게 마지막으로 자리잡은 순간
05_step_into_city.png    그 옷차림으로 도시로 나가는 첫 걸음
06_brand_end.png         직접 디자인 (AI 생성 비권장)
```

## 7. 공통 스타일 프롬프트

```text
cinematic, 35mm lens, natural light, premium Korean fashion campaign mood, hyper-realistic clothing texture, vertical 9:16 framing, elegant and confident, no on-screen text, no watermark, no logo, no random letters, no distorted hands, no extra fingers, no deformed face, no duplicated person, no fantasy magical sparkles, no cartoon look
```

네거티브:

```text
cartoon, anime, magical sparkles, fantasy transformation, glowing aura, plastic skin, distorted body, extra limbs, extra fingers, broken typography, watermark, logo, random letters, unreadable phone UI text
```

## 8. 키이미지 생성 프롬프트 (통합본 — 그대로 복사)

### Cut 1. Typing Thought

```text
Vertical 9:16 close-up shot of a young Korean woman's hand holding a smartphone, her thumb mid-tap on a clean minimal text input interface, the typed Korean phrase "꾸안꾸 데이트룩" visible on the screen in clean sans-serif, the last few letters of the phrase beginning to dissolve into delicate light particles drifting upward off the screen, soft morning light, cinematic, 35mm lens, natural light, premium Korean fashion campaign mood, hyper-realistic clothing texture, vertical 9:16 framing, elegant and confident, no other on-screen text, no watermark, no logo, no random letters, no distorted hands, no extra fingers.

Negative prompt: cartoon, anime, magical sparkles, fantasy transformation, glowing aura, plastic skin, distorted body, extra limbs, extra fingers, broken typography, watermark, logo, random letters, unreadable phone UI text.
```

### Cut 2. Outline Form

```text
Vertical 9:16 cinematic shot of a dark soft void, fine warm light particles converging in the center to form the faint outline of a complete outfit — a relaxed knit top, a midi skirt or wide trousers, hinted shoulders and waistline — drawn as if by precise light brushstrokes, no human body fully visible yet, a sense of something becoming real, cinematic, 35mm lens, premium Korean fashion campaign mood, hyper-realistic intent, vertical 9:16 framing, elegant restraint, no on-screen text, no watermark, no logo, no random letters, no fantasy magical sparkles.

Negative prompt: cartoon, anime, magical sparkles, fantasy transformation, glowing aura, plastic skin, distorted body, extra limbs, extra fingers, broken typography, watermark, logo, random letters.
```

### Cut 3. Fabric Render

```text
Vertical 9:16 macro close-up of fabric texture forming inside the outfit outline — a soft ivory cotton knit weave on the upper area transitioning to a dark indigo denim weave below, the threads visibly assembling into the surface of real garments, premium tactile realism, no human face visible, only the surface and the shoulder line, cinematic, 35mm lens, natural light, premium Korean fashion campaign mood, hyper-realistic clothing texture, vertical 9:16 framing, no on-screen text, no watermark, no logo, no random letters.

Negative prompt: cartoon, anime, magical sparkles, fantasy transformation, glowing aura, plastic skin, distorted body, broken typography, watermark, logo, random letters, unrealistic fabric.
```

### Cut 4. Dress Complete

```text
Vertical 9:16 close-up shot of the completed outfit on a young Korean woman's body — face not yet visible, framed from collarbone to hip — a soft ivory knit top tucked into wide black tailored trousers, hands lightly adjusting the hem, the last fabric fold settling naturally, premium daily Korean fashion mood, calm confidence, cinematic, 35mm lens, natural light, hyper-realistic clothing texture, vertical 9:16 framing, no on-screen text, no watermark, no logo, no random letters, no distorted hands, no extra fingers.

Negative prompt: cartoon, anime, magical sparkles, fantasy transformation, glowing aura, plastic skin, distorted body, extra limbs, extra fingers, broken typography, watermark, logo, random letters.
```

### Cut 5. Step Into City

```text
Vertical 9:16 cinematic full-body shot of the same young Korean woman taking her first step out of an apartment doorway into a soft daylight Seoul street, wearing the ivory knit top and wide black tailored trousers, calm confident posture, slight low angle, the light just hitting her shoulders and the fabric, urban background gently blurred, premium Korean fashion campaign mood, hyper-realistic clothing texture, vertical 9:16 framing, no on-screen text, no watermark, no logo, no random letters, no distorted body, no extra limbs.

Negative prompt: cartoon, anime, magical sparkles, fantasy transformation, glowing aura, plastic skin, distorted body, extra limbs, extra fingers, broken typography, watermark, logo, random letters, unnatural pose, catalogue posing.
```

## 9. Image-to-Video 프롬프트

### Clip 1 (Typing Thought) — 6초

```text
Create a 6-second cinematic vertical 9:16 shot. The thumb completes the typing motion, the typed Korean phrase "꾸안꾸 데이트룩" is fully visible for a brief moment, then the letters lift off the screen and dissolve upward into fine warm light particles that drift out of the phone. The phone slowly fades into shadow as the particles take over the frame. No magical sparkles, no glow burst, no random letters, no logo, no watermark, no extra fingers.
```

### Clip 2 (Outline Form) — 4초

```text
Create a 4-second cinematic vertical 9:16 shot. The drifting warm light particles in a dark soft void converge toward the center and trace the outline of a complete daily outfit — knit top and wide trousers — with precise restrained motion, like a designer's pencil drawing in light. The outline must read as clothing, not as a fantasy aura. No glowing aura, no sparkle burst, no on-screen text, no logo, no watermark.
```

### Clip 3 (Fabric Render) — 2초

```text
Create a 2-second cinematic vertical 9:16 macro shot. The outline fills in with real fabric texture — ivory knit weave on top transitioning into indigo denim below — visible threads assembling into the surface of real garments. Hyper-realistic tactile transition. No glow, no sparkle, no fantasy effect, no logo, no watermark.
```

### Clip 4 (Dress Complete) — 2초

```text
Create a 2-second cinematic vertical 9:16 close-up shot. The last fold of the ivory knit top settles, hands lightly adjust the hem at the waist of black wide trousers, the body becomes fully visible from collarbone to hip. Calm confident energy. No magical transition into the body, the fabric should appear as if just placed by a designer. No on-screen text, no logo, no watermark, no distorted hands.
```

### Clip 5 (Step Into City) — 4초

```text
Create a 4-second cinematic vertical 9:16 full-body shot. The same Korean woman steps from an apartment doorway out onto a soft daylight Seoul street, calm confident stride, the camera pulls back gently as she walks forward. The light catches the fabric naturally. Premium fashion campaign energy, not catalogue posing. No magical sparkles, no transformation, no on-screen text, no logo, no watermark, no face change.
```

## 10. Prompt-Only 통합 단일 프롬프트 (18초 한 번에)

영상 툴이 긴 영상을 한 번에 생성할 수 있는 경우 사용.

```text
Create an 18-second cinematic brand film in vertical 9:16 format for an AI fashion service called I.F. The story shows the service mechanic visually: a typed wish becomes light, light becomes the outline of an outfit, outline becomes real fabric, fabric becomes a dressed person, the person walks into the city. The same young Korean woman appears throughout — face hidden until the final 6 seconds.

Act 1 — The Thought (0:00–0:06): close-up of her hand holding a smartphone, her thumb finishes typing the Korean phrase "꾸안꾸 데이트룩" on a clean minimal text input. The typed letters lift off the screen and dissolve upward into fine warm light particles. The phone fades into shadow as the particles fill the frame. No magical sparkle, no glow burst.

Act 2 — The Render (0:06–0:12): in a dark soft void, the light particles converge and trace the outline of a complete daily outfit — knit top and wide trousers — like a designer's pencil drawing in light. The outline then fills with real fabric texture: ivory knit weave on top, indigo denim below, visible threads assembling. The fabric settles onto her body, framed from collarbone to hip, hands lightly adjusting the hem. No fantasy transformation, only precise visualization.

Act 3 — The Wear (0:12–0:18): the camera pulls back to reveal her in full, she steps from an apartment doorway into a soft daylight Seoul street, calm confident stride, light catching the fabric naturally. End with a 1.5-second black card: white I.F. wordmark center, white sans-serif line below: "Wear what you imagine."

Premium Korean fashion campaign mood throughout, cinematic 35mm look, natural light, hyper-realistic clothing texture, elegant and confident, no on-screen text during cuts, no watermark, no logo, no random letters, no glowing aura, no magical sparkles, no distorted hands, no extra fingers, no face change, no duplicated person.
```

## 11. 편집 타임라인

```text
00:00 – 00:02   Cut 1a   타이핑 close-up,  소프트 키 클릭
00:02 – 00:04   Cut 1b   글자가 빛으로 흩어짐, 사운드가 빨려들어감
00:04 – 00:06   Cut 2    빛 입자 응축, 미세한 저음 비트 시작
00:06 – 00:08   Cut 3a   윤곽선 그리기, 가벼운 패브릭 스치는 소리
00:08 – 00:10   Cut 3b   패브릭 텍스처 채워짐, 비트 1번
00:10 – 00:12   Cut 4    옷이 자리잡음, 짧은 정적
00:12 – 00:15   Cut 5a   문 열고 도시로 줌아웃, 발걸음 소리
00:15 – 00:16.5 Cut 5b   옆모습 + 거리 빛, 환경음
00:16.5 – 00:18 End      검은 화면 + 로고, 단단한 저음 1번 + 정적
```

전환은 Act 1·2 사이는 빛으로 자연스럽게 morph, Act 2·3 사이는 부드러운 cross-dissolve, 엔드는 fade-to-black.

## 12. 사운드 디자인

- Act 1: 소프트한 단일 키 클릭 → 모든 환경음이 빨려들어가는 짧은 인하일레이션 효과
- Act 2: 미세한 입자 사운드, 짧은 패브릭 마찰음, 박자감 있는 저음 비트 2회
- Act 3: 발걸음, 도시 앰비언트, 마지막 1초의 단단한 저음 1번

음악은 사용 가능하지만, 템포가 영상 비트(Type · Render · Step)와 어긋나지 않도록 신중히. 음악 없이 사운드 디자인만으로도 완성도 확보 가능.

## 13. UI 노출

- Act 1 시작 0~2초 사이에 **단어 입력 화면 0.5초**만 명확히 보임 ("꾸안꾸 데이트룩"이 읽혀야 함)
- 그 이후 영상 내 다른 UI 노출 없음
- 0.5초가 짧아 보이지만, 키 입력 클로즈업이라 충분히 인지됨

## 14. 채널 매핑

| 채널 | 적합도 | 비고 |
|---|---|---|
| 모두의창업 Q8 영상 | ★★★★★ | 12초 안에 서비스 메커니즘 전달 |
| 웹 랜딩 히어로 (16:9 컷다운) | ★★★★★ | "이 서비스가 뭔가"를 시각적으로 즉시 답함 |
| 인스타그램 릴스 | ★★★★ | 호기심 유발은 Plan A가 더 강함, 단 전환력은 Plan B가 강함 |
| 쓰레드 | ★★★★ | 동일 |
| 유튜브 쇼츠 | ★★★★ | 자동재생 환경에서 끝까지 보게 됨 |

## 15. 16:9 가로 컷다운 (16초, 웹 랜딩용)

```text
00:00 – 00:05   Act 1 압축 — 타이핑부터 빛 입자 흩어짐까지
00:05 – 00:10   Act 2 압축 — 윤곽선 → 패브릭 → 옷이 자리잡음
00:10 – 00:14   Act 3 — 도시로 나가는 풀샷
00:14 – 00:16   End card
```

가로 버전에서는 인물이 더 크게 나오므로 데스크톱 히어로 영상으로 더 효과적이다. 단, 9:16 세로 버전의 변환 디테일이 더 강하므로 메인 채널은 세로.

## 16. 품질 체크리스트

- [ ] 12초 안에 "상상 → AI → 실물" 흐름이 시각적으로 전달되는가?
- [ ] UI 노출은 0.5초 이내인가?
- [ ] 변환이 "마법 같은 판타지"가 아니라 "정교한 시각화"로 보이는가?
- [ ] 인물 얼굴은 Act 3 시작 이후에만 등장하는가?
- [ ] 마지막 클로즈업에서 옷의 텍스처와 실재감이 강조되는가?
- [ ] 보고 난 뒤 "이거 어떻게 쓰는 거지?"가 아니라 "이거 써보고 싶다"가 떠오르는가?
- [ ] Act 사이의 비트가 사운드와 정확히 맞는가?

## 17. 최종 판단

이 광고는 **서비스의 메커니즘을 정직하게 보여준다.** Plan A처럼 여운으로 호기심을 만들진 않지만, **"이 서비스가 무엇을 하는가"를 첫 12초 안에 답한다**. 모두의창업 심사위원이 영상 한 편으로 I.F.를 이해해야 하는 자리, 웹 랜딩에서 첫 방문자가 5초 안에 "써볼만한가"를 판단해야 하는 자리에 가장 강하다.

광고가 끝났을 때 보는 사람이 떠올려야 할 한 문장:

> *"내가 말하면, AI가 그리고, 진짜로 입을 수 있다."*

이 한 문장이 보는 사람의 머리에 남는다면 이 광고는 성공한 것이다.
