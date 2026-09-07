# DODAN LAB SOLUTION (도단) 홈페이지

Eleventy(11ty)로 만든 정적 홈페이지입니다. 빌드하면 순수 HTML/CSS/JS만 나오기 때문에
Cloudflare Pages에 그대로 무료로 배포할 수 있습니다.

- 홈 / 회사소개(연혁·오시는길) / 취급분야·메이커 소개 / 납품일지(블로그형 게시판) / 공지사항 / 문의하기 / 개인정보처리방침
- 문의 폼은 별도 서버 없이 **Web3Forms**(무료)를 통해 이메일로 전달됩니다.
- 납품일지·공지사항은 **마크다운 파일 하나 = 게시글 하나**로 관리합니다. 블로그 쓰듯이 파일만 추가하면 됩니다.

---

## 1. 로컬에서 미리보기

```bash
npm install
npm start
```

브라우저에서 `http://localhost:8080` 접속. 파일을 수정하면 자동으로 새로고침됩니다.

배포용으로 빌드만 하려면:

```bash
npm run build
```

`_site/` 폴더에 완성된 정적 파일이 생성됩니다. 이 폴더가 실제로 배포되는 결과물입니다.

---

## 2. 자주 수정하게 될 파일

| 무엇을 바꾸고 싶을 때 | 수정할 파일 |
|---|---|
| 회사명, 전화번호, 이메일, 주소, 도메인 등 기본 정보 | `src/_data/site.js` |
| 홈 화면 문구/섹션 | `src/index.njk` |
| 회사소개, 연혁, 오시는길 | `src/about.njk` |
| 취급분야, 메이커(대리점/특약점) 소개 | `src/makers.njk` |
| 문의 폼 항목 | `src/contact.njk` |
| 개인정보처리방침 | `src/privacy.njk` |
| 디자인(색상, 여백, 폰트 등) | `src/css/style.css` (상단 `:root` 변수에서 색상 관리) |
| 로고 이미지 | `src/assets/logo/` |

---

## 3. 납품일지 / 공지사항 글쓰기 (블로그처럼 작성하는 방법)

두 가지 방법이 있습니다. **방법 A(웹 에디터)**가 실제로 쓰기 편하고, **방법 B(마크다운 파일)**는
설정 없이 지금 바로 가능한 방식입니다.

### 방법 A. 웹 에디터(CMS)로 쓰기 — 추천, 최초 설정 1회 필요

`/admin` 페이지에서 로그인하면 제목·날짜·본문을 입력하는 화면(Sveltia CMS, 무료 오픈소스)이 나옵니다.
"게시(Publish)" 버튼을 누르면 자동으로 GitHub 저장소에 글 파일이 만들어지고, Cloudflare Pages가
1~2분 내 자동으로 재배포합니다. 블로그 관리자 화면과 거의 동일한 경험입니다.

**사전 조건**: 이 사이트가 **GitHub 저장소와 연결된 Cloudflare Pages(Git 연동)**로 배포되어 있어야
합니다. 현재 직접 업로드 방식으로 배포하셨다면, 먼저 아래 "5. Cloudflare Pages 배포 방법 → 방법 A"를
따라 Git 연동으로 전환해 주세요.

**최초 설정 순서 (한 번만 하면 계속 사용 가능)**

1. **GitHub 저장소 준비** — 이미 방법 A로 배포하셨다면 건너뛰기.

2. **GitHub OAuth App 만들기**
   - https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
   - Application name: 아무 이름 (예: `도단 CMS`)
   - Homepage URL: `https://ddnlabsol.com`
   - Authorization callback URL: 일단 `https://example.workers.dev/callback`으로 두고 저장 (3번에서
     실제 주소가 나오면 다시 돌아와 수정합니다)
   - **Register application** → **Client ID** 확인 → **Generate a new client secret** →
     **Client Secret** 확인 (이때 한 번만 보이므로 메모장에 복사해 두세요)

3. **OAuth 처리용 Cloudflare Worker 배포** (`sveltia-cms-auth`)
   - https://github.com/sveltia/sveltia-cms-auth 저장소 페이지의 안내를 따라 Cloudflare Workers에
     배포합니다 (저장소를 Fork한 뒤 Cloudflare 대시보드 → **Workers & Pages** → **Create application**
     → **Connect to Git**으로 연결하는 방식이 가장 쉽습니다)
   - 배포된 Worker → **Settings** → **Variables and Secrets**에서 추가:
     - `GITHUB_CLIENT_ID` = 2번의 Client ID
     - `GITHUB_CLIENT_SECRET` = 2번의 Client Secret (Secret으로 등록)
   - 배포 완료 후 나오는 Worker 주소를 확인합니다 (예: `https://sveltia-cms-auth.내계정.workers.dev`)
   - 2번으로 돌아가서 Authorization callback URL을 `https://<위 Worker 주소>/callback`으로 정확히
     수정 후 저장

4. **`src/admin/config.yml` 수정**
   ```yaml
   backend:
     name: github
     repo: 본인GitHub아이디/dodan-site   # 실제 저장소 이름으로 교체
     branch: main
     base_url: https://sveltia-cms-auth.내계정.workers.dev   # 3번의 Worker 주소로 교체
   ```
   수정 후 git commit/push (Cloudflare Pages가 자동 재배포합니다)

5. `https://ddnlabsol.com/admin/` 접속 → **Login with GitHub** → 로그인 후 좌측에서
   "납품일지" 또는 "공지사항" 선택 → **New** 버튼으로 글쓰기 → 다 쓰면 **Publish**

막히는 단계가 있으면 화면 캡처로 물어봐 주시면 바로 짚어드리겠습니다.

> **더 간단한 대안(OAuth App·Worker 설정 없이)**: `/admin` 로그인 화면에서 "GitHub personal access
> token"으로 로그인하는 옵션을 쓰면 2·3번을 건너뛰고 GitHub에서 발급받은 토큰 하나만 붙여넣어 바로
> 쓸 수 있습니다. 다만 로그인 정보가 그 브라우저에만 저장되어, 다른 기기·브라우저에서 쓰려면 토큰을
> 다시 입력해야 합니다. 혼자 한 대의 컴퓨터에서만 글을 쓰신다면 이 방법이 제일 간단합니다.

### 방법 B. 마크다운 파일 직접 추가 (설정 없이 지금 바로 가능)

CMS 설정 전이거나, 파일을 직접 다루는 게 더 편하시면 이 방법을 쓰시면 됩니다.

#### 납품일지 새 글 추가

1. `src/board/deliveries/` 폴더에 새 파일 생성 (예: `2025-09-10-my-post.md`)
2. 아래 형식으로 작성:

```markdown
---
title: "제품명 납품 사례 — 거래처명(선택)"
date: 2025-09-10
productName: "Reagent"        # 목록에 표시될 배지 텍스트 (선택)
summary: "목록에서 보일 한 줄 요약"  # (선택)
---

## 문의 내용

- **문의 시약명**: ...
- **제품번호**: ...
- **수량 / 용량**: ...

## 진행 과정

본문은 마크다운으로 자유롭게 작성하면 됩니다. `##`은 소제목, `-`는 목록입니다.
```

이미지를 추가하려면 `src/assets/uploads/` 폴더에 이미지 파일을 넣고, 프런트매터에
`image: /assets/uploads/파일명.jpg`를 한 줄 추가하면 상세 페이지 상단과(공지사항의 경우) 홈 화면
캐러셀에 표시됩니다.

3. 저장 후 `npm start`로 확인 → 문제 없으면 git에 커밋/푸시 (Cloudflare Pages가 자동으로 재배포합니다)

#### 공지사항 새 글 추가

`src/board/notices/` 폴더에 같은 방식으로 `.md` 파일을 추가합니다. `productName` 대신
`category`(예: "파트너십", "운영안내", "행사") 필드를 사용할 수 있습니다.

#### 샘플 글 삭제

`src/board/deliveries/2025-06-02-sample-elisa-kit.md`, `2025-07-18-sample-antibody.md`는
작성 예시입니다. 실제 납품 사례가 쌓이면 삭제하거나 내용을 교체해 주세요.

---

## 4. 문의 폼 이메일 연결 (Web3Forms)

지금은 `src/_data/site.js`의 `web3formsKey` 값이 `REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY`로
되어 있어 실제 전송은 되지 않습니다. 아래 순서로 30초면 연결할 수 있습니다.

1. https://web3forms.com 접속 → 이메일 주소(smh@ddnlab.kr)만 입력하고 무료 Access Key 발급
2. 이메일로 받은 Access Key를 `src/_data/site.js`의 `web3formsKey` 값에 붙여넣기
3. `npm run build` 후 재배포

이후부터 문의 폼에 접수된 내용이 smh@ddnlab.kr로 바로 이메일 전송됩니다. (Web3Forms 무료
플랜은 월 250건까지 무료입니다.)

---

## 5. Cloudflare Pages 배포 방법

### 방법 A. Git 연동 (권장 — 이후 파일만 추가하면 자동 배포)

1. 이 폴더를 GitHub(또는 GitLab) 저장소로 올립니다.
   ```bash
   git init
   git add .
   git commit -m "도단 홈페이지 초기 버전"
   git branch -M main
   git remote add origin <저장소 주소>
   git push -u origin main
   ```
2. Cloudflare 대시보드 → **Workers & Pages** → **Create application** → **Pages** →
   **Connect to Git** → 방금 만든 저장소 선택
3. 빌드 설정:
   - Build command: `npx @11ty/eleventy`
   - Build output directory: `_site`
4. Save and Deploy. 완료되면 `*.pages.dev` 임시 주소로 접속됩니다.
5. **Custom domains** 탭에서 `ddnlabsol.com` 추가 → 안내에 따라 DNS 연결(도메인을 Cloudflare
   레지스트라에서 구매했다면 자동으로 처리됩니다).

이후에는 `src/board/...`에 글만 추가하고 `git push`만 하면 자동으로 재배포됩니다.

### 방법 B. Wrangler CLI로 수동 업로드 (Git 없이)

```bash
npm install -g wrangler
npm run build
wrangler pages deploy _site --project-name=dodan-lab-solution
```

처음 실행 시 Cloudflare 로그인 창이 뜹니다. 이후 배포할 때마다 `npm run build` →
`wrangler pages deploy _site` 두 줄만 실행하면 됩니다.

---

## 6. 배포 전 꼭 확인해 주세요

- [ ] `src/_data/site.js`의 `web3formsKey`를 실제 키로 교체했는지
- [ ] `src/privacy.njk`(개인정보처리방침)가 실제 운영 방식과 맞는지 검토했는지 (법률 자문 아님 — 필요시 개인정보보호위원회 표준 양식 참고)
- [ ] `src/board/deliveries/`의 샘플 글 2개를 실제 사례로 교체했는지
- [ ] `src/_data/makersByCategory.js`를 실제 메이커 리스트로 채웠는지
- [ ] `src/about.njk`의 연혁 날짜(월 단위)가 실제와 맞는지
- [ ] CMS를 쓰신다면 `src/admin/config.yml`의 `repo` / `base_url`을 실제 값으로 교체했는지

---

## 7. 다음에 추가하면 좋은 것들 (선택)

- 실제 로고 파일에서 "DODAN LAB SOLUTION" 워드마크에 쓰인 정확한 서체 확인 → 웹폰트로 교체 (현재는 유사한 Poppins 서체 사용 중)
- 네이버 서치어드바이저 / Google Search Console 등록 및 `sitemap.xml` 제출
- 네이버 스마트플레이스 등록 (네이버 지도·검색 노출)
