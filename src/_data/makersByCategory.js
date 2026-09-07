// 취급분야(카테고리)별 메이커 목록.
// 아직 정리된 실제 리스트를 받기 전까지는 확인된 파트너사만 넣고,
// 나머지는 빈 배열([])로 두어 "목록 준비 중"으로 표시됩니다.
//
// 실제 리스트를 받으면 아래 형태로 채워 넣으면 됩니다:
//   reagent: [
//     { name: "켐원 (ChemON)", tag: "특약점" },
//     { name: "제조사명", tag: "공식 대리점" },   // tag는 선택 항목
//     { name: "제조사명" },
//   ],
//
// 카테고리 id는 src/_data/site.js 의 categories 배열과 일치해야 합니다.
// (reagent, antibody, elisa, prepkit, media, consumable, instrument)

module.exports = {
  reagent: [{ name: "켐원 (ChemON)", tag: "특약점" }],
  instrument: [{ name: "PHCbi", tag: "공식 대리점 · 대전" }],
  antibody: [],
  elisa: [],
  prepkit: [],
  media: [],
  consumable: [],
};
