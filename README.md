# 한잔 (HANJAN)

> **"스와이프 말고, 지금 만나세요"**
> 실시간 위치 기반 즉흥 만남 매칭 앱

한잔(HANJAN)은 지금 이 순간, 주변에 있는 사람과 커피·밥·한잔·산책 등 즉흥적인 만남을 연결해주는 O2O 소셜 앱입니다.

---

## 디렉터리 구조

```
HANJAN/
├── hanjan-app/          ← React Native + Expo (모바일 앱)
├── hanjan-server/       ← NestJS (백엔드 API)
├── hanjan-shared/       ← 공유 타입/상수/열거형
├── docker-compose.yml   ← 로컬 개발 환경 (PostgreSQL + Redis)
└── README.md
```

---

## 기술 스택

- **모바일 앱**: Expo (React Native) + Expo Router + Zustand + TanStack Query
- **백엔드**: NestJS + Prisma ORM + Socket.io
- **데이터베이스**: PostgreSQL + PostGIS (위치 기반 쿼리) + Redis (세션/캐시)
- **인증**: JWT + 휴대폰 OTP + 신분증 OCR + 실시간 셀피 인증
- **결제**: RevenueCat (구독 + 인앱 구매)
- **푸시 알림**: Firebase Cloud Messaging (FCM)
- **파일 저장**: AWS S3 + AWS Rekognition (얼굴 인증)

---

## 사전 요구사항

| 도구 | 최소 버전 | 설치 방법 |
|------|---------|---------|
| Node.js | 20.x 이상 | https://nodejs.org |
| npm / pnpm | 최신 | `npm install -g pnpm` |
| Docker Desktop | 최신 | https://docker.com |
| Expo CLI | 최신 | `npm install -g @expo/cli` |
| EAS CLI | 최신 | `npm install -g eas-cli` |
| Xcode (iOS 빌드, macOS만) | 15 이상 | App Store |
| Android Studio (Android 빌드) | 최신 | https://developer.android.com/studio |

---

## 로컬 개발 환경 설정

### 1단계: 인프라 실행 (Docker)

```bash
docker-compose up -d
```

정상 실행 확인:
```bash
docker-compose ps
# hanjan-db    → Up (PostgreSQL + PostGIS)
# hanjan-redis → Up
```

### 2단계: 환경 변수 설정

```bash
# 서버 환경 변수
cp hanjan-server/.env.example hanjan-server/.env

# 앱 환경 변수
cp hanjan-app/.env.example hanjan-app/.env
```

각 `.env` 파일을 열어 실제 값으로 교체하세요.

### 3단계: 서버 설정 및 실행

```bash
cd hanjan-server
npm install
npx prisma migrate dev      # DB 마이그레이션
npx prisma db seed          # (선택) 초기 테스트 데이터
npm run start:dev           # → http://localhost:3000
```

### 4단계: 앱 실행

```bash
cd hanjan-app
npm install
npx expo start              # → Expo Go 앱으로 QR 코드 스캔
```

---

## EAS Build 가이드

### 사전 설정

```bash
# Expo 계정 로그인
eas login

# 프로젝트 초기화 (최초 1회)
cd hanjan-app
eas init
```

`hanjan-app/app.json`의 `extra.eas.projectId`와 `owner`를 실제 Expo 계정 정보로 업데이트하세요.

### Android 빌드

```bash
# APK (직접 배포용 / 홈페이지 다운로드)
eas build --platform android --profile preview

# APK (프로덕션 직접 배포용)
eas build --platform android --profile apk-direct

# AAB (Google Play Store용)
eas build --platform android --profile production
```

### iOS 빌드

```bash
# IPA (Ad Hoc, 내부 테스트용)
eas build --platform ios --profile preview

# IPA (App Store 제출용)
eas build --platform ios --profile production
```

### 스토어 제출

```bash
# Google Play Store 제출
eas submit --platform android --profile production

# App Store 제출
eas submit --platform ios --profile production
```

---

## RevenueCat 설정 체크리스트

- [ ] [RevenueCat 계정](https://app.revenuecat.com) 생성
- [ ] iOS 앱 등록 → iOS API 키 → `hanjan-app/.env`의 `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`에 입력
- [ ] Android 앱 등록 → Android API 키 → `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID`에 입력
- [ ] 웹훅 URL 설정: `https://api.hanjan.app/api/subscriptions/webhook`
- [ ] 웹훅 시크릿 → `hanjan-server/.env`의 `REVENUECAT_WEBHOOK_SECRET`에 입력
- [ ] 상품 설정 (App Store Connect + Google Play Console에서 먼저 생성 후 RevenueCat에 연결):
  - `hanjan_plus_monthly` — 한잔 Plus 월간 (₩9,900/월)
  - `hanjan_plus_yearly` — 한잔 Plus 연간 (₩59,900/년)
  - `hanjan_boost_1h` — 지금 부스트 (₩2,900, 소모성)
  - `hanjan_extra_turn` — 한번 더 (₩1,900, 소모성)
  - `hanjan_timer_extend` — 타이머 연장 (₩1,500, 소모성)
  - `hanjan_second_chance` — 두번째 인상 (₩2,500, 소모성)
- [ ] Entitlement `premium` 생성 → 위 구독 상품 연결

---

## 앱 아이콘 교체 가이드

`hanjan-app/src/assets/images/` 폴더의 이미지를 실제 디자인 파일로 교체하세요.

| 파일 | 크기 | 용도 |
|------|------|------|
| `icon.png` | 1024×1024 | iOS 앱 아이콘 |
| `adaptive-icon.png` | 512×512 | Android 어댑티브 아이콘 전경 |
| `splash.png` | 1284×2778 | 스플래시 스크린 |

- **메인 컬러**: Primary Coral `#FF6B52`
- **배경색**: Warm White `#FFF8F5`
- **Android 어댑티브 배경색**: `#FF6B52` (app.json에 설정됨)

---

## 핵심 기능

- 실시간 위치 기반 활동 지도 (6가지 카테고리: 커피·밥·한잔·산책·문화·뭐든)
- 신분증 + 실시간 셀피 인증으로 100% 실명 기반 안전 매칭
- 30분 타이머 채팅으로 장소 약속 → 만남 확정 플로우
- 매너 점수 시스템 + 리뷰 태그
- 레퍼럴 리워드 (친구 3명 초대 시 Plus 1개월 무료)
- 한잔 Plus 구독 (RevenueCat) + 인앱 단건 구매
- 안심 만남 설정 + 긴급 신고 기능

---

## 디자인 시스템

- **Primary Color**: Coral `#FF6B52`
- **Background**: Warm White `#FFF8F5`
- **Font**: Pretendard Variable
- **Spacing**: 8pt grid
- **Corner Radius**: 12-20dp (카드 기준)

---

## 주요 명령어

```bash
# 인프라
docker-compose up -d          # DB + Redis 시작
docker-compose down           # 중지

# 서버
cd hanjan-server
npm run start:dev             # 개발 서버
npm run build                 # 프로덕션 빌드
npx prisma studio             # DB GUI

# 앱
cd hanjan-app
npx expo start                # Expo 개발 서버
npx expo run:ios              # iOS 시뮬레이터
npx expo run:android          # Android 에뮬레이터

# EAS 빌드
eas build --platform android --profile preview      # Android APK
eas build --platform android --profile production   # Android AAB
eas build --platform ios --profile preview          # iOS Ad Hoc IPA
eas build --platform ios --profile production       # iOS App Store IPA

# 스토어 제출
eas submit --platform android --profile production  # Play Store
eas submit --platform ios --profile production      # App Store
```

---

## 라이선스

Copyright © 2025 HANJAN. All rights reserved.
이 소스코드는 납품 계약 조건에 따라 사용됩니다.
