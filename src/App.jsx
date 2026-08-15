import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════
//  지역
// ══════════════════════════════════════════════════════════
// 좌표는 파고 데이터가 잘 나오도록 항구는 방파제 끝~외해 쪽, 섬은 섬 주변 열린 바다 기준
// kind: "내만"(항·방파제·연안) / "원도"(배 타고 나가는 먼바다 섬)
const REGIONS = [
  // ═══ 서해 · 내만 ═══
  { id:"incheon",     name:"인천(연안부두)", sea:"서해", kind:"내만", lat:37.445, lon:126.590 },
  { id:"yeongheung",  name:"영흥도",         sea:"서해", kind:"내만", lat:37.245, lon:126.428 },
  { id:"daebu",       name:"대부도(방아머리)", sea:"서해", kind:"내만", lat:37.289, lon:126.560 },
  { id:"dangjin",     name:"당진(왜목)",     sea:"서해", kind:"내만", lat:37.001, lon:126.520 },
  { id:"taean",       name:"태안(안흥항)",   sea:"서해", kind:"내만", lat:36.660, lon:126.130 },
  { id:"mongsanpo",   name:"태안(몽산포)",   sea:"서해", kind:"내만", lat:36.640, lon:126.300 },
  { id:"daecheon",    name:"보령(대천항)",   sea:"서해", kind:"내만", lat:36.320, lon:126.510 },
  { id:"muchangpo",   name:"보령(무창포)",   sea:"서해", kind:"내만", lat:36.257, lon:126.520 },
  { id:"seocheon",    name:"서천(홍원항)",   sea:"서해", kind:"내만", lat:36.070, lon:126.540 },
  { id:"gunsan",      name:"군산(비응항)",   sea:"서해", kind:"내만", lat:35.930, lon:126.520 },
  { id:"gyeokpo",     name:"부안(격포항)",   sea:"서해", kind:"내만", lat:35.617, lon:126.460 },
  { id:"yeonggwang",  name:"영광(안마도권)", sea:"서해", kind:"내만", lat:35.320, lon:126.130 },
  // ═══ 서해 · 원도(먼바다 섬) ═══
  { id:"gyeokryeol",  name:"격렬비열도",     sea:"서해", kind:"원도", lat:36.630, lon:125.560 },
  { id:"eocheong",    name:"어청도",         sea:"서해", kind:"원도", lat:36.117, lon:125.980 },
  { id:"yeondo",      name:"연도(외연도)",   sea:"서해", kind:"원도", lat:36.230, lon:126.080 },
  { id:"gaeya",       name:"개야도",         sea:"서해", kind:"원도", lat:36.010, lon:126.400 },
  { id:"wido",        name:"위도",           sea:"서해", kind:"원도", lat:35.618, lon:126.300 },
  { id:"gageo",       name:"가거도",         sea:"서해", kind:"원도", lat:34.071, lon:125.113 },
  { id:"hongdo",      name:"홍도",           sea:"서해", kind:"원도", lat:34.686, lon:125.196 },
  { id:"heuksan",     name:"흑산도",         sea:"서해", kind:"원도", lat:34.681, lon:125.435 },

  // ═══ 남해 · 내만 ═══
  { id:"mokpo",       name:"목포",           sea:"남해", kind:"내만", lat:34.760, lon:126.340 },
  { id:"jindo",       name:"진도(서망항)",   sea:"남해", kind:"내만", lat:34.360, lon:126.150 },
  { id:"wando",       name:"완도",           sea:"남해", kind:"내만", lat:34.300, lon:126.760 },
  { id:"goheung",     name:"고흥(녹동항)",   sea:"남해", kind:"내만", lat:34.520, lon:127.130 },
  { id:"yeosu",       name:"여수",           sea:"남해", kind:"내만", lat:34.740, lon:127.760 },
  { id:"namhae",      name:"남해(미조항)",   sea:"남해", kind:"내만", lat:34.700, lon:127.900 },
  { id:"samcheonpo",  name:"삼천포",         sea:"남해", kind:"내만", lat:34.900, lon:128.070 },
  { id:"changseon",   name:"남해(창선)",     sea:"남해", kind:"내만", lat:34.850, lon:128.000 },
  { id:"tongyeong",   name:"통영",           sea:"남해", kind:"내만", lat:34.800, lon:128.430 },
  { id:"geoje",       name:"거제(장승포)",   sea:"남해", kind:"내만", lat:34.880, lon:128.700 },
  { id:"busan",       name:"부산(가덕도)",   sea:"남해", kind:"내만", lat:35.020, lon:128.830 },
  { id:"busanhae",    name:"부산(해운대권)", sea:"남해", kind:"내만", lat:35.150, lon:129.170 },
  // ═══ 남해 · 원도(먼바다 섬) ═══
  { id:"gukdo",       name:"국도",           sea:"남해", kind:"원도", lat:34.550, lon:128.230 },
  { id:"jwasari",     name:"좌사리도",       sea:"남해", kind:"원도", lat:34.520, lon:128.180 },
  { id:"galdo",       name:"갈도",           sea:"남해", kind:"원도", lat:34.470, lon:128.130 },
  { id:"maemuldo",    name:"매물도",         sea:"남해", kind:"원도", lat:34.640, lon:128.560 },
  { id:"yeoseo",      name:"여서도",         sea:"남해", kind:"원도", lat:34.040, lon:126.920 },
  { id:"cheongsan",   name:"청산도",         sea:"남해", kind:"원도", lat:34.170, lon:126.870 },
  { id:"geomun",      name:"거문도",         sea:"남해", kind:"원도", lat:34.030, lon:127.310 },
  { id:"baekdo",      name:"백도",           sea:"남해", kind:"원도", lat:34.030, lon:127.560 },
  { id:"sori",        name:"연화·소리도",    sea:"남해", kind:"원도", lat:34.560, lon:127.780 },
  { id:"noksan",      name:"거제(홍도·매물권)", sea:"남해", kind:"원도", lat:34.520, lon:128.560 },

  // ═══ 동해 · 연안 ═══
  { id:"busan_e",     name:"부산(기장)",     sea:"동해", kind:"내만", lat:35.240, lon:129.230 },
  { id:"ulsan",       name:"울산(정자항)",   sea:"동해", kind:"내만", lat:35.640, lon:129.470 },
  { id:"guryongpo",   name:"포항(구룡포)",   sea:"동해", kind:"내만", lat:35.990, lon:129.560 },
  { id:"pohang",      name:"포항(영일만)",   sea:"동해", kind:"내만", lat:36.070, lon:129.440 },
  { id:"yeongdeok",   name:"영덕(강구항)",   sea:"동해", kind:"내만", lat:36.360, lon:129.400 },
  { id:"uljin",       name:"울진(후포항)",   sea:"동해", kind:"내만", lat:36.680, lon:129.470 },
  { id:"samcheok",    name:"삼척(장호항)",   sea:"동해", kind:"내만", lat:37.250, lon:129.340 },
  { id:"donghae",     name:"동해(묵호항)",   sea:"동해", kind:"내만", lat:37.550, lon:129.130 },
  { id:"gangneung",   name:"강릉(주문진)",   sea:"동해", kind:"내만", lat:37.900, lon:128.840 },
  { id:"yangyang",    name:"양양(남애항)",   sea:"동해", kind:"내만", lat:38.010, lon:128.720 },
  { id:"sokcho",      name:"속초",           sea:"동해", kind:"내만", lat:38.210, lon:128.610 },
  { id:"goseong_e",   name:"고성(거진항)",   sea:"동해", kind:"내만", lat:38.450, lon:128.470 },
  { id:"ulleung",     name:"울릉도",         sea:"동해", kind:"원도", lat:37.480, lon:130.900 },
];
const SEAS = ["서해","남해","동해"];

// ══════════════════════════════════════════════════════════
//  어종 데이터 (웹 검색 기반 실제값) · peak=피크월, season=전체시즌
//  category: 어류 / 두족류(오징어문어) / 기타
// ══════════════════════════════════════════════════════════
const FISH = [
  { id:"galchi", name:"갈치", emoji:"🐟", cat:"어류", tempMin:20, tempMax:27, tempNote:"20℃↑ 먹이활동 활발 (아열대성)", zone:"여수·거문도·백도, 제주 (먼바다 채낚기)",
    tideBest:"3물~7물", tideNote:"사리엔 조류 빨라 불리 · 조금엔 입질 약함", season:"7~12월", peak:"9~11월", seasonPeak:[9,10,11], seasonAll:[7,8,9,10,11,12],
    ban:"7월 중 (근해채낚기 등, 매년 고시)", minSize:"항문장 18cm", banNote:"금어기는 어업별로 다름 · 낚시객은 체장 준수", depth:"표층~중층 (선상 50~100m)", best:"밤 · 바람 잦아든 초저녁",
    tips:["추광성 — 집어등/케미라이트에 잘 모임","초저녁 바람 터지면 조과 급락","11~12월 연안 굵은 씨알 마릿수","찬바람에 연안서 빠지면 시즌 종료"] },
  { id:"gwangeo", name:"광어(넙치)", emoji:"🐟", cat:"어류", tempMin:10, tempMax:25, tempNote:"15~22℃ 활동성 최고 · 산란기 2~6월", zone:"서해 전역·남해 서부 (안흥·격포·가거도)",
    tideBest:"3~7물 (바닥 찍기 편함)", tideNote:"모래·펄 바닥에 붙어 생활", season:"4~11월", peak:"5~6월·10월", seasonPeak:[5,6,10], seasonAll:[4,5,6,7,8,9,10,11],
    ban:"없음 (금지체장만)", minSize:"35cm", banNote:"넙치 35cm 미만 방생", depth:"10~200m 모래·혼무니 바닥", best:"서해 방조제·선상 다운샷",
    tips:["다운샷 웜·생새우로 바닥 공략","치어방류로 자원 풍부해져 전문 대상어화","모래와 암반 섞인 지형 선호","서해 루어·선상 외줄 모두 가능"] },
  { id:"ureok", name:"우럭(조피볼락)", emoji:"🐟", cat:"어류", tempMin:8, tempMax:22, tempNote:"8~22℃ (냉수에 강함)", zone:"서해 전역·남해·동해 (선상 우럭 전국)",
    tideBest:"3~7물", tideNote:"먼바다 선상은 물때 영향 적음", season:"연중 (4~6월 대물)", peak:"4~6월", seasonPeak:[4,5,6], seasonAll:[1,2,3,4,5,6,7,8,9,10,11,12],
    ban:"없음", minSize:"23cm 권장", banNote:"법정 금지체장은 없으나 자원보호 위해 23cm↓ 방생", depth:"암초·인공어초 바닥", best:"서해 선상 외줄낚시",
    tips:["서해 대표 입문 어종","23cm 미만은 방생 (자원보호)","볼락·열기와 함께 낚임","산란 전후 봄철이 굵은 씨알"] },
  { id:"gamseongdom", name:"감성돔", emoji:"🐠", cat:"어류", tempMin:15, tempMax:22, tempNote:"15~22℃ 활동성 최고", zone:"남해 갯바위 전역·서해 원도 (여수·완도·통영)",
    tideBest:"중간 물때 (사리 정중앙 피함)", tideNote:"영등철엔 느린 조류·물돌이 때 유리", season:"3~6월·10~11월", peak:"4~5월·10~11월", seasonPeak:[4,5,10,11], seasonAll:[3,4,5,6,10,11],
    ban:"5/1~5/31", minSize:"25cm", banNote:"산란기 보호 · 25cm 미만 방생", depth:"7~8m 여밭·수중여", best:"해질녘 전후 30분 · 갯바위",
    tips:["'바다의 왕자' — 수심 깊은 여밭 선호","미끼 크릴/게살","경사 완만·바닥 밋밋한 곳 잘 붙음","영등철(2~3월) 대물 노림"] },
  { id:"chamdom", name:"참돔", emoji:"🐠", cat:"어류", tempMin:14, tempMax:24, tempNote:"봄·가을 연안 회유", zone:"남해·제주 (통영·거제·여서도)",
    tideBest:"3~7물 (조류 있는 날)", tideNote:"타이라바·선상 지깅", season:"4~5월·10~11월", peak:"4~5월·10~11월", seasonPeak:[4,5,10,11], seasonAll:[4,5,6,9,10,11],
    ban:"없음", minSize:"24cm", banNote:"24cm 미만 방생", depth:"20~150m 중층~저층", best:"선상 타이라바 · 물돌이",
    tips:["봄 산란기 대물 '벚꽃돔'","타이라바·인치쿠로 공략","조류 흐를 때 입질 활발"] },
  { id:"nongeo", name:"농어", emoji:"🐟", cat:"어류", tempMin:14, tempMax:24, tempNote:"루어 대표 어종", zone:"남해·서해 하구 (여수·군산·강화)",
    tideBest:"들물~날물 교차 (물돌이)", tideNote:"조석차 클수록 포인트 중요", season:"5~10월", peak:"5~7월", seasonPeak:[5,6,7], seasonAll:[5,6,7,8,9,10],
    ban:"없음", minSize:"없음", banNote:"법정 규제 없음 (자원보호 배려)", depth:"수문·방파제·갯바위", best:"새벽·해질녘 · 루어",
    tips:["'바다의 육상' — 강한 파이팅","하드베이트·미노우 캐스팅","수문·기수역 포인트","제주는 연중 가능"] },
  { id:"doldom", name:"돌돔", emoji:"🐠", cat:"어류", tempMin:16, tempMax:26, tempNote:"여름 고수온기 피크", zone:"남해 원도·제주 (거문도·추자·가거도)",
    tideBest:"3~5물·11~13물 (사리 피함)", tideNote:"물돌이 때 입질 잦음 · 탁한 물 피함", season:"6월중순~10월말", peak:"7~9월", seasonPeak:[7,8,9], seasonAll:[6,7,8,9,10],
    ban:"없음", minSize:"24cm", banNote:"24cm 미만 방생 권장", depth:"암초대 10~15m", best:"아침~오전 (해 뜬 후 2시간)",
    tips:["주행성 — 아침이 피크","성게·소라·게 미끼","얕은 여밭은 파도 있는 날 유리","'갯바위의 황제' 강한 손맛"] },
  { id:"bangeo", name:"방어", emoji:"🐟", cat:"어류", tempMin:12, tempMax:22, tempNote:"겨울철 최고 횟감", zone:"제주·남해·동해 남부 (겨울 방어)",
    tideBest:"본류대 조류 흐를 때", tideNote:"베이트 무리 추적", season:"9~1월", peak:"11~1월", seasonPeak:[11,12,1], seasonAll:[9,10,11,12,1],
    ban:"없음", minSize:"없음 (대방어 보호 권장)", banNote:"소형 방어 방생 권장", depth:"20~150m 중층~저층", best:"지깅·캐스팅 · 남해/제주/동해",
    tips:["10kg↑ 대물은 '대방어'","메탈지그 지깅이 기본","겨울철 기름진 육질 최고","강력한 파이팅·지구력"] },
  { id:"samchi", name:"삼치", emoji:"🐟", cat:"어류", tempMin:15, tempMax:24, tempNote:"회유성 · 빠른 유영", zone:"동해 (경주 감포·포항), 남해 원도",
    tideBest:"조류 흐르는 날", tideNote:"표층 베이트 추적", season:"9~11월·5월", peak:"9~11월", seasonPeak:[9,10,11], seasonAll:[5,9,10,11],
    ban:"5월 (신설, 매년 고시)", minSize:"항문장 21cm", banNote:"산란기 보호", depth:"표층~중층", best:"메탈 캐스팅 · 동해/남해",
    tips:["이빨 날카로워 와이어 리더 필수","은빛 메탈지그 빠른 릴링","가을 기름 오른 삼치 별미"] },
  { id:"godeungeo", name:"고등어", emoji:"🐟", cat:"어류", tempMin:14, tempMax:22, tempNote:"14~22℃ · 일출·일몰 전후 공격성↑", zone:"남해·동해 (부산·통영·포항)",
    tideBest:"조류 있는 물때", tideNote:"표층 카고·사비키", season:"6~11월", peak:"8~11월", seasonPeak:[8,9,10,11], seasonAll:[6,7,8,9,10,11],
    ban:"4~6월 중 한 달 (매년 고시)", minSize:"21cm", banNote:"매년 해수부 고시로 기간 지정", depth:"표층~중층", best:"일출·일몰 전후 · 방파제",
    tips:["은빛 반사 미끼(스푼·파리)에 폭발","사비키 채비로 마릿수","가을 기름 오른 고등어 최상"] },
  { id:"bolrak", name:"볼락", emoji:"🐟", cat:"어류", tempMin:8, tempMax:18, tempNote:"찬물 좋아하는 겨울 대표어", zone:"남해·동해 전역 (통영·거제·울산·경주·포항·영덕·울진)",
    tideBest:"1~4물·8~10물 (느린 조류)", tideNote:"야간에 활성↑", season:"11~4월", peak:"12~3월", seasonPeak:[12,1,2,3], seasonAll:[11,12,1,2,3,4],
    ban:"없음", minSize:"15cm", banNote:"조피볼락 등 볼락류 15cm 미만 방생", depth:"암초·테트라포드 사이", best:"밤 · 남해 갯바위/방파제",
    tips:["경상도 '뽈락' · 겨울 대표 손맛","웜·미끼 야간 라이트게임","암초 틈에 은신 — 정밀 공략","잡식성 — 새우·물고기 다 먹음"] },
  { id:"muneo", name:"문어", emoji:"🐙", cat:"두족류", tempMin:12, tempMax:22, tempNote:"15~22℃ 활동성 최고", zone:"동해·남해 (포항·영덕·통영)",
    tideBest:"조금~중물 (약한 조류)", tideNote:"물 맑고 조류 세지 않을 때", season:"7~9월", peak:"7~8월", seasonPeak:[7,8], seasonAll:[7,8,9],
    ban:"시·도 별도 지정", minSize:"금지체중 신설", banNote:"지역별 금어기 상이 · 관할 고시 확인", depth:"10~100m 바닥권", best:"물색 맑은 낮 · 바닥 공략",
    tips:["대문어는 동해·남해 깊은 여밭","에기/문어지그로 바닥 탐색","격투력 강해 채비 튼튼하게"] },
  { id:"gapojingeo", name:"갑오징어", emoji:"🦑", cat:"두족류", tempMin:12, tempMax:24, tempNote:"12~24℃", zone:"서해·남해 (태안·군산·여수)",
    tideBest:"무시~3물 (약한 물때)", tideNote:"바닥 서식 — 조류 약해야 채비 안착", season:"봄3~5월·가을9~11월", peak:"4~5월·10~11월", seasonPeak:[4,5,10,11], seasonAll:[3,4,5,9,10,11],
    ban:"없음", minSize:"없음", banNote:"자원보호 위해 소형 방생 권장", depth:"5~50m (바닥 20~50cm)", best:"에깅 · 물흐름 느린 날",
    tips:["시력 좋아 에기 색상에 민감","서해 오천·군산, 남해 여수·통영·거제","고패질로 천천히 작은 폭 유인","봄 대물·가을 마릿수 두 시즌"] },
  { id:"jukkumi", name:"주꾸미", emoji:"🐙", cat:"두족류", tempMin:15, tempMax:25, tempNote:"가을철 연안 수온대", zone:"서해 (태안·보령·서산)",
    tideBest:"2물~5물", tideNote:"조금물때가 사리보다 유리", season:"8~11월", peak:"9~10월", seasonPeak:[9,10], seasonAll:[8,9,10,11],
    ban:"5/11~8/31", minSize:"없음", banNote:"산란·성장기 4개월 포획 금지", depth:"얕은 바닥권", best:"가을 서해 선상 · 새벽 출항",
    tips:["묵직해지면 한 템포 늦춰 챔질","천수만처럼 개체 많으면 물때 무관","바닥까지 에기 내려 고패질","금어기(5.11~8.31) 확인"] },
  { id:"munui", name:"무늬오징어", emoji:"🦑", cat:"두족류", tempMin:18, tempMax:28, tempNote:"18~28℃", zone:"남해·제주 (통영·거제·여수 무늬오징어)",
    tideBest:"조류 완만한 물때", tideNote:"바람·탁한 물·비 직후·민물 유입 피함", season:"봄4~6월·가을9~11월", peak:"5~6월·10월", seasonPeak:[5,6,10], seasonAll:[4,5,6,9,10,11],
    ban:"없음", minSize:"없음", banNote:"자원보호 위해 소형 방생 권장", depth:"5~50m", best:"제주 에깅 · 야간낚시",
    tips:["제주 인기 에깅, 킬로급 손맛","서귀포 남원 연중 가능(16℃↑)","먹물 묻은 에기는 교체","봄 산란기 대물·가을 마릿수"] },
  { id:"hanchi", name:"한치", emoji:"🦑", cat:"두족류", tempMin:20, tempMax:28, tempNote:"여름 고수온기", zone:"제주·동해·남해 (여름 한치)",
    tideBest:"조류 완만한 밤", tideNote:"집어등에 모임", season:"6~8월", peak:"6~8월", seasonPeak:[6,7,8], seasonAll:[6,7,8],
    ban:"없음", minSize:"없음", banNote:"자원보호 위해 소형 방생 권장", depth:"표층~중층", best:"밤 선상 · 남해/제주 집어등",
    tips:["여름밤 선상 대표 어종","집어등에 베이트 모아 공략","막대찌·수중집어등 병행","제주·남해 여름 별미"] },
  { id:"salojingeo", name:"살오징어", emoji:"🦑", cat:"두족류", tempMin:12, tempMax:22, tempNote:"동해 대표 · 최근 서해도 출현", zone:"동해·남해 먼바다 (울릉·포항·강릉·남해 원도)",
    tideBest:"조류 완만한 밤", tideNote:"집어등 채비", season:"6~12월", peak:"9~10월", seasonPeak:[9,10], seasonAll:[6,7,8,9,10,11,12],
    ban:"4/1~5/31 (연안, 매년 고시)", minSize:"외투장 15cm", banNote:"어린 오징어 보호 강화", depth:"표층~중층", best:"밤 선상 · 동해/서해 집어등",
    tips:["초보도 하루 50수 거뜬","묶음바늘(이카바늘) 채비","수온 상승으로 서해 어청도도 대풍","동해가 본거지지만 광역 확산"] },
];

const CATS=["전체","어류","두족류"];

// 현재 날짜가 금어기 기간에 속하는지 (MM/DD 범위 파싱)
function isInBanPeriod(banStr, date){
  if(!banStr) return false;
  // "5/1~5/31", "5/11~8/31", "4/1~5/31 (연안, 매년 고시)" 등에서 날짜 추출
  const m=banStr.match(/(\d{1,2})\/(\d{1,2})\s*~\s*(\d{1,2})\/(\d{1,2})/);
  if(!m) return false;
  const [_,m1,d1,m2,d2]=m.map(Number);
  const y=date.getFullYear();
  const start=new Date(y,m1-1,d1), end=new Date(y,m2-1,d2);
  const cur=new Date(y,date.getMonth(),date.getDate());
  if(start<=end) return cur>=start && cur<=end;
  return cur>=start || cur<=end; // 연말~연초 걸침
}

// ══════════════════════════════════════════════════════════
//  물때 · 조석 계산
// ══════════════════════════════════════════════════════════
const MULTTAE = ["일곱물","여덟물","아홉물","열물","열한물","열두물","열셋물","조금","무시","한물","두물","세물","네물","다섯물","여섯물"];
function lunarAge(d){ const NM=Date.UTC(2000,0,6,18,14),S=29.530588853; const x=(d.getTime()-NM)/86400000; return ((x%S)+S)%S; }
function getMulttae(d){
  const a=lunarAge(d); let ld=Math.floor(a)+1; if(ld>30)ld=30;
  const idx=ld<=15?(ld-1)%15:(ld-16)%15;
  const dist=Math.min(Math.abs(a-0),Math.abs(a-14.77),Math.abs(a-29.53));
  let strength,level;
  if(dist<2){strength="사리";level=5;}else if(dist<4){strength="중사리";level=4;}
  else if(dist<6){strength="중물";level=3;}else if(dist<8){strength="조금물";level=2;}else{strength="조금";level=1;}
  return { name:MULTTAE[idx], strength, level, lunarDay:ld };
}
// 하루 조석 4회 (시각 + 조위 근사 cm + 조류세기 %)
function getTides(d){
  const a=lunarAge(d); const baseHigh=(a*0.8067)%12.42;
  const amp = 150 + 150*Math.abs(Math.cos(a/29.53*Math.PI*2)); // 사리 크고 조금 작게
  const out=[]; let t=baseHigh; const types=["만조","간조","만조","간조"];
  for(let i=0;i<4;i++){
    const hh=Math.floor(t)%24, mm=Math.floor((t%1)*60);
    const isHigh=types[i]==="만조";
    const lvl = isHigh ? Math.round(300+amp) : Math.round(150-amp*0.6);
    out.push({ type:types[i], time:`${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`, level:Math.max(0,lvl), hour:hh+mm/60 });
    t+=6.21;
  }
  out.sort((x,y)=>x.hour-y.hour);
  return out;
}
// ── 조류 세기 % (종합 물 상태) ──
// 물때(조석) + 파도 + 바람을 합쳐 그날 바다가 얼마나 세게 움직이는지 0~100%로 표현
//   · 평상시(바람·파도 보통) 사리 ≈ 70%가 물때 최고치
//   · 파도 완전 잔잔 ≈ 1~2%
//   · 태풍·강풍이면 파도/바람 가산으로 100%까지 꽉 참 (100% 상한)
// level: 물때 세기 1(조금)~5(사리) / waveH: 파고(m) / wind: 풍속(m/s)
function currentFlowPct(level, waveH, wind){
  // 1) 물때 기여분: 조금(level1) 약 6% → 사리(level5) 약 70%
  const tideBase = [0, 6, 22, 40, 56, 70][level] ?? 40;
  // 2) 파도 기여분: 0.5m 이하 거의 0 → 3m면 상한 근처. 평상시 작은 파고는 거의 영향 없게
  const wv = waveH ?? 0;
  const waveAdd = Math.max(0, (wv - 0.5)) * 16; // 1m≈8, 2m≈24, 3m≈40
  // 3) 바람 기여분: 4m/s 이하 거의 0 → 강풍일수록 가산
  const wd = wind ?? 0;
  const windAdd = Math.max(0, (wd - 4)) * 2.2; // 10m/s≈13, 15m/s≈24
  let pct = tideBase + waveAdd + windAdd;
  // 파도가 정말 잔잔해도(0.5m↓) 조금 물때는 5~7% 유지 (완전 0 아님)
  if(wv <= 0.5 && wd <= 3 && level <= 1) pct = Math.max(5, Math.min(pct, 7));
  return Math.round(Math.max(1, Math.min(100, pct))); // 1~100% 상한
}
// 물때만의 대표 세기(파고·바람 모르는 목록/미래날짜용) — 사리 70%, 조금 6% 기준
function tideOnlyPct(level){ return [0,6,22,40,56,70][level] ?? 40; }
// 일출/일몰 (간이)
function sunTimes(d,lat){
  const N=Math.floor((d-new Date(d.getFullYear(),0,0))/86400000);
  const decl=-23.45*Math.cos((360/365)*(N+10)*Math.PI/180);
  const latR=lat*Math.PI/180, decR=decl*Math.PI/180;
  const cosH=-Math.tan(latR)*Math.tan(decR);
  const H=Math.acos(Math.max(-1,Math.min(1,cosH)))*180/Math.PI/15;
  const noon=12.5;
  const fmt=h=>`${String(Math.floor(h)%24).padStart(2,"0")}:${String(Math.floor((h%1)*60)).padStart(2,"0")}`;
  return { sunrise:fmt(noon-H), sunset:fmt(noon+H) };
}

// ══════════════════════════════════════════════════════════
//  체감수온
// ══════════════════════════════════════════════════════════
function feelsSea(sea,air,wind,wave){
  if(sea==null)return null; let f=sea;
  f-=wind*0.35; if(air!=null&&air<sea)f-=(sea-air)*0.15; if(wave!=null)f-=wave*1.2;
  return f;
}

// ══════════════════════════════════════════════════════════
//  API
// ══════════════════════════════════════════════════════════
// 해양 데이터 1회 호출
async function fetchMarine(lat,lon){
  try{
    const m=await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}`+
      `&current=sea_surface_temperature,wave_height,wave_period,wave_direction,ocean_temperature_0m,ocean_temperature_20m,ocean_temperature_50m`+
      `&hourly=wave_height,wave_period,wave_direction&timezone=Asia%2FSeoul&forecast_days=7`).then(r=>r.json());
    return m;
  }catch(e){ return null; }
}
// 파고 값이 실제로 들어있는지 검사
function hasWave(m){
  if(!m) return false;
  const cur=m?.current?.wave_height;
  const hrly=m?.hourly?.wave_height;
  const hourlyOk = Array.isArray(hrly) && hrly.some(v=>v!=null);
  return (cur!=null) || hourlyOk;
}
async function fetchAll(lat,lon){
  const wx=fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`+
    `&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,relative_humidity_2m,precipitation`+
    `&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation_probability`+
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_probability_max`+
    `&timezone=Asia%2FSeoul&wind_speed_unit=ms&forecast_days=7`).then(r=>r.json());

  // 해양 데이터: 파고가 안 나오면(내만 지형) 바다 쪽으로 좌표를 옮겨가며 재시도
  // 8방위로 약 3km(≈0.03도)씩, 최대 6km까지 넓혀가며 열린 바다를 찾음
  const marPromise=(async()=>{
    let m=await fetchMarine(lat,lon);
    if(hasWave(m)) return m;
    const offsets=[
      [0.03,0],[-0.03,0],[0,0.03],[0,-0.03],
      [0.03,0.03],[0.03,-0.03],[-0.03,0.03],[-0.03,-0.03],
      [0.06,0],[-0.06,0],[0,0.06],[0,-0.06],
    ];
    for(const [dLat,dLon] of offsets){
      const m2=await fetchMarine(lat+dLat, lon+dLon);
      if(hasWave(m2)) return m2;
    }
    return m; // 다 실패하면 원본(파고 null) 반환
  })();

  const [w,m]=await Promise.all([wx,marPromise]); return {w,m};
}

// 미리보기/오프라인용 샘플 데이터 (실제 앱에선 위 fetchAll이 진짜 데이터를 채움)
function sampleData(){
  const now=new Date();
  const midnight=new Date(now.getFullYear(),now.getMonth(),now.getDate()); // 오늘 0시
  const hourly={time:[],temperature_2m:[],weather_code:[],wind_speed_10m:[],wind_direction_10m:[],wind_gusts_10m:[],precipitation_probability:[]};
  const wave=[];
  for(let i=0;i<168;i++){ // 7일 × 24시간
    const t=new Date(midnight.getTime()+i*3600000);
    const hh=t.getHours();
    hourly.time.push(t.toISOString());
    hourly.temperature_2m.push(26+4*Math.sin((hh-9)/24*2*Math.PI)+Math.random());
    hourly.weather_code.push([0,1,2,2,3,80][Math.floor(Math.random()*6)]);
    hourly.wind_speed_10m.push(2+3*Math.abs(Math.sin(i/6))+Math.random());
    hourly.wind_direction_10m.push((180+i*15)%360);
    hourly.wind_gusts_10m.push(4+4*Math.abs(Math.sin(i/6))+Math.random());
    hourly.precipitation_probability.push(Math.floor(Math.random()*40));
    wave.push(0.4+0.5*Math.abs(Math.sin(i/8)));
  }
  const daily={time:[],temperature_2m_max:[],temperature_2m_min:[],weather_code:[],wind_speed_10m_max:[],wind_direction_10m_dominant:[],precipitation_probability_max:[]};
  for(let i=0;i<7;i++){
    const t=new Date(midnight.getTime()+i*86400000);
    daily.time.push(t.toISOString().slice(0,10));
    daily.temperature_2m_max.push(29+Math.random()*3);
    daily.temperature_2m_min.push(22+Math.random()*2);
    daily.weather_code.push([0,1,2,3,80,1,2][i%7]);
    daily.wind_speed_10m_max.push(4+Math.random()*4);
    daily.wind_direction_10m_dominant.push((200+i*30)%360);
    daily.precipitation_probability_max.push(Math.floor(Math.random()*60));
  }
  return {
    _sample:true,
    w:{ current:{temperature_2m:28.5,apparent_temperature:31,wind_speed_10m:2.8,wind_direction_10m:200,wind_gusts_10m:5.2,weather_code:2,relative_humidity_2m:54,precipitation:0}, hourly, daily },
    m:{ current:{sea_surface_temperature:24.3,wave_height:0.5,wave_period:4.2,wave_direction:190,ocean_temperature_0m:24.3,ocean_temperature_20m:19.8,ocean_temperature_50m:15.2}, hourly:{wave_height:wave,wave_period:wave.map(()=>4),wave_direction:wave.map(()=>190)} },
  };
}
const WMO={0:["맑음","☀️"],1:["대체로 맑음","🌤️"],2:["구름 조금","⛅"],3:["흐림","☁️"],45:["안개","🌫️"],48:["짙은 안개","🌫️"],51:["약한 이슬비","🌦️"],53:["이슬비","🌦️"],55:["강한 이슬비","🌧️"],61:["약한 비","🌧️"],63:["비","🌧️"],65:["강한 비","🌧️"],71:["약한 눈","🌨️"],73:["눈","🌨️"],75:["강한 눈","❄️"],80:["소나기","🌦️"],81:["소나기","🌧️"],82:["강한 소나기","⛈️"],95:["뇌우","⛈️"],96:["우박 뇌우","⛈️"],99:["강한 뇌우","⛈️"]};
function windDir(deg){return ["북","북동","동","남동","남","남서","서","북서"][Math.round(deg/45)%8];}
function windArrow(deg){return ["↓","↙","←","↖","↑","↗","→","↘"][Math.round(deg/45)%8];} // 바람이 불어가는 방향
function fishingScore(level,wind,wave){let s=0;if(level===3||level===4)s+=2;else if(level===5||level===2)s+=1;if(wind<4)s+=2;else if(wind<7)s+=1;else if(wind>=10)s-=1;if(wave!=null){if(wave<0.5)s+=1;else if(wave>=1.5)s-=1;}if(s>=4)return{label:"출조 최적",color:"#1f9d55",bg:"#e4f5ea",fg:"#177a41",emoji:"🎣"};if(s>=2)return{label:"무난",color:"#c98a00",bg:"#fdf3dc",fg:"#8a6200",emoji:"🙂"};return{label:"신중",color:"#c0392b",bg:"#fbe6e3",fg:"#a5301f",emoji:"⚠️"};}

// 밝은 낮 바다 테마
//  bg=연한 하늘 배경 / card=흰 카드 / card2=아주 연한 하늘 / text=진한 남색 글자
const C={
  bg:"#eaf5fc",        // 전체 배경: 밝은 하늘빛
  card:"#ffffff",      // 카드: 흰색
  card2:"#eef6fc",     // 보조 카드/칸: 아주 연한 하늘
  border:"#d3e6f2",    // 옅은 하늘 테두리
  blue:"#1f6fb2",      // 진한 바다색(강조·제목)
  lblue:"#3a90cf",     // 밝은 바다색(보조 강조)
  gray:"#5f7c92",      // 회색 글자(밝은 배경용, 충분히 진하게)
  amber:"#b5730a",     // 경고 앰버(밝은 배경용 진하게)
  gold:"#a06a00",      // 골드(밝은 배경에서 읽히게 진하게)
  text:"#12344f",      // 기본 본문 글자: 진한 남색
  textSub:"#3d5a72",   // 보조 본문 글자
};

// ══════════════════════════════════════════════════════════
//  기상특보 (자체 판정 · 풍속/파고 기준)
//  ※ 공식 기상청 특보 아님 — 앱이 가진 예보값으로 위험 수준을 자체 계산
//  기상청 풍랑주의보 기준(풍속 14m/s↑ 3h지속 또는 파고 3m↑)을 참고한 근사치
// ══════════════════════════════════════════════════════════
function getMarineAlert(windMax, waveMax, gustMax){
  // windMax: 향후 예보 최대 풍속(m/s), waveMax: 최대 파고(m), gustMax: 최대 순간풍속
  const w=windMax??0, wv=waveMax??0, g=gustMax??0;
  // 경보 수준 (풍랑경보 근사: 풍속 21m/s↑ 또는 파고 5m↑)
  if(w>=21 || wv>=5 || g>=26){
    return {level:"경보", label:"풍랑경보 수준", color:"#c0392b", bg:"rgba(192,57,43,0.18)",
      msg:"매우 위험 — 출조 금지 권장", emoji:"🚨"};
  }
  // 주의보 수준 (풍랑주의보 근사: 풍속 14m/s↑ 또는 파고 3m↑)
  if(w>=14 || wv>=3 || g>=20){
    return {level:"주의보", label:"풍랑주의보 수준", color:"#e67e22", bg:"rgba(230,126,34,0.16)",
      msg:"위험 — 출조 재검토, 안전 최우선", emoji:"⚠️"};
  }
  // 주의 수준 (강풍/높은 물결 근접)
  if(w>=10 || wv>=2 || g>=14){
    return {level:"주의", label:"바람·물결 주의", color:"#c98a00", bg:"rgba(201,138,0,0.14)",
      msg:"연안·갯바위 주의, 원도 출조 신중", emoji:"🟡"};
  }
  return null; // 특보 없음(양호)
}

// ══════════════════════════════════════════════════════════
//  메인
// ══════════════════════════════════════════════════════════
const TABS=[
  ["forecast","🌊","바다예보"],["weather","⛅","날씨"],["wind","💨","바람·파고"],
  ["tide","🌙","물때"],["chart","🗺️","전자해도"],["point","📍","포인트"],
];
const CHART_URL="https://www.khoa.go.kr/oceanmap/main.do"; // 전자해도(국립해양조사원)

export default function FishingApp(){
  const [tab,setTab]=useState("forecast");
  const _defaultRegion=REGIONS.find(r=>r.id==="samcheonpo")||REGIONS[0];
  const [region,setRegion]=useState(_defaultRegion);
  const [selSea,setSelSea]=useState(_defaultRegion.sea); // 선택한 바다(서해/남해/동해/제주)
  const [ptQuery,setPtQuery]=useState("");   // 포인트 검색어
  const [ptOpen,setPtOpen]=useState(false);  // 포인트 목록 열림 여부
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [selFish,setSelFish]=useState(FISH[0]);
  const [selCat,setSelCat]=useState("전체");
  const [isSample,setIsSample]=useState(false);
  const today=new Date();
  const month=today.getMonth()+1;

  useEffect(()=>{let alive=true;setLoading(true);setIsSample(false);
    fetchAll(region.lat,region.lon)
      .then(res=>{if(alive){
        if(!res||!res.w||!res.w.current){
          // 실제 데이터 실패 → 샘플로 대체 (미리보기에서도 모든 탭 확인 가능)
          setData(sampleData());setIsSample(true);
        }else{ setData(res); }
        setLoading(false);
      }})
      .catch(()=>{if(alive){setData(sampleData());setIsSample(true);setLoading(false);}});
    return()=>{alive=false;};
  },[region]);

  useEffect(()=>{ if(region.sea!==selSea) setSelSea(region.sea); },[region]);

  const mt=getMulttae(today);
  const tides=getTides(today);
  const sun=sunTimes(today,region.lat);
  const cur=data?.w?.current;
  const seaTemp=data?.m?.current?.sea_surface_temperature;
  const seaTemp20=data?.m?.current?.ocean_temperature_20m;
  const seaTemp50=data?.m?.current?.ocean_temperature_50m;
  const waveH=data?.m?.current?.wave_height;
  const wavePeriod=data?.m?.current?.wave_period;
  const [wxText,wxEmoji]=WMO[cur?.weather_code??0]||["-","🌡️"];
  const feels=cur?feelsSea(seaTemp,cur.temperature_2m,cur.wind_speed_10m,waveH):null;
  const score=cur?fishingScore(mt.level,cur.wind_speed_10m,waveH):null;
  // ── 기상특보 판정: 향후 24시간 최대 풍속·파고·순간풍속 ──
  const marineAlert=(()=>{
    const hw=data?.w?.hourly, hm=data?.m?.hourly;
    if(!hw?.wind_speed_10m) return null;
    const n=Math.min(24, hw.wind_speed_10m.length);
    let wMax=cur?.wind_speed_10m??0, gMax=cur?.wind_gusts_10m??0, wvMax=waveH??0;
    for(let i=0;i<n;i++){
      if(hw.wind_speed_10m[i]!=null) wMax=Math.max(wMax, hw.wind_speed_10m[i]);
      if(hw.wind_gusts_10m?.[i]!=null) gMax=Math.max(gMax, hw.wind_gusts_10m[i]);
      if(hm?.wave_height?.[i]!=null) wvMax=Math.max(wvMax, hm.wave_height[i]);
    }
    return getMarineAlert(wMax, wvMax, gMax);
  })();
  const dateStr=`${today.getMonth()+1}월 ${today.getDate()}일 (${["일","월","화","수","목","금","토"][today.getDay()]})`;
  const fishInSeason=f=>f.seasonPeak.includes(month);

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Pretendard',-apple-system,sans-serif",color:C.text,paddingBottom:72}}>
      <style>{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');*{box-sizing:border-box;margin:0}::-webkit-scrollbar{display:none}
        select option{background:#ffffff;color:#12344f;}`}</style>

      {/* 헤더 */}
      <div style={{background:"linear-gradient(160deg,#5cb3e8 0%,#3d8fd4 45%,#2f6fb5 100%)",padding:"14px 16px 20px",borderBottom:"none",position:"sticky",top:0,zIndex:10,overflow:"hidden"}}>
        {/* 밝은 낮 바다 물결 그래픽 (헤더 하단 은은하게) */}
        <svg viewBox="0 0 480 60" preserveAspectRatio="none" style={{position:"absolute",left:0,right:0,bottom:-1,width:"100%",height:34,opacity:0.5,pointerEvents:"none"}}>
          <path d="M0,30 C80,10 160,50 240,30 C320,10 400,50 480,30 L480,60 L0,60 Z" fill="rgba(255,255,255,0.25)"/>
          <path d="M0,40 C80,22 160,58 240,40 C320,22 400,58 480,40 L480,60 L0,60 Z" fill="rgba(255,255,255,0.18)"/>
        </svg>
        <div style={{position:"relative",zIndex:1}}>
        {/* 앱 로고 */}
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
          <span style={{fontSize:22}}>🌊</span>
          <span style={{fontSize:20,fontWeight:900,letterSpacing:-0.5,color:"#fff",textShadow:"0 1px 3px rgba(0,40,80,0.35)"}}>바다조황</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:600,marginTop:4}}>물때·수온·날씨·조황</span>
        </div>
        {/* 날짜 (상단 우측) */}
        <div style={{textAlign:"right",fontSize:11,color:"rgba(255,255,255,0.92)",marginBottom:6}}>{dateStr} · 음력 {mt.lunarDay}일 · {mt.name}</div>

        {/* 바다 버튼 3개 + 짧은 검색창 */}
        <div style={{display:"flex",gap:6,marginBottom:7}}>
          {SEAS.map(s=>(
            <button key={s} onClick={()=>{
                setSelSea(s); setPtQuery(""); setPtOpen(false);
                const first=REGIONS.find(r=>r.sea===s);
                if(first) setRegion(first);
              }}
              style={{flex:1,padding:"8px 0",borderRadius:9,border:"none",cursor:"pointer",fontSize:15,fontWeight:800,
                background: selSea===s ? "#fff" : "rgba(255,255,255,0.25)",
                color: selSea===s ? C.blue : "#fff"}}>
              {s}
            </button>
          ))}
          {/* 짧은 검색창 */}
          <div style={{position:"relative",width:96,flexShrink:0}}>
            <input
              value={ptOpen?ptQuery:""}
              onChange={e=>{setPtQuery(e.target.value); if(!ptOpen)setPtOpen(true);}}
              onFocus={()=>{setPtOpen(true); setPtQuery("");}}
              onBlur={()=>{setTimeout(()=>setPtOpen(false),180);}}
              placeholder="🔍검색"
              style={{width:"100%",padding:"8px 8px",fontSize:13,fontWeight:700,borderRadius:9,border:"none",
                background:"rgba(255,255,255,0.95)",color:C.text,outline:"none",boxSizing:"border-box"}}/>
            {ptOpen && ptQuery && (
              <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,width:200,maxHeight:280,overflowY:"auto",
                background:"#fff",borderRadius:10,boxShadow:"0 6px 20px rgba(0,40,80,0.25)",zIndex:60,padding:"4px 0"}}>
                {(()=>{
                  const q=ptQuery.trim().toLowerCase();
                  // 검색은 전체 바다에서 (바다 상관없이 이름으로 찾기)
                  const list=REGIONS.filter(r=>r.name.toLowerCase().includes(q));
                  if(list.length===0) return <div style={{padding:"12px 14px",fontSize:13,color:C.gray}}>검색 결과 없음</div>;
                  return list.map(r=>(
                    <div key={r.id}
                      onMouseDown={()=>{setRegion(r); setSelSea(r.sea); setPtOpen(false); setPtQuery("");}}
                      style={{padding:"10px 14px",fontSize:14,fontWeight:700,cursor:"pointer",color:C.text,
                        display:"flex",alignItems:"center",gap:6}}>
                      <span>{r.kind==="원도"?"🚢":"📍"}</span>{r.name}
                      <span style={{fontSize:10,color:C.gray,marginLeft:"auto"}}>{r.sea}</span>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>

        {/* 선택한 바다의 포인트 목록 (가로 스크롤 칩) */}
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,marginBottom:5}}>
          {REGIONS.filter(r=>r.sea===selSea).map(r=>(
            <button key={r.id} onClick={()=>setRegion(r)}
              style={{flexShrink:0,padding:"7px 12px",borderRadius:16,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,
                background: r.id===region.id ? "#fff" : "rgba(255,255,255,0.18)",
                color: r.id===region.id ? C.blue : "#fff"}}>
              {r.kind==="원도"?"🚢 ":""}{r.name}
            </button>
          ))}
        </div>
        <div style={{fontSize:10.5,color:"rgba(255,255,255,0.85)"}}>
          🚢 = 배 타고 나가는 먼바다 섬(원도) · 현재: <span style={{color:"#fff",fontWeight:700}}>{region.name}</span>
          {region.kind==="원도" && <span style={{color:"#ffe9b0"}}> · 출조 전 여객선·낚싯배 운항 확인</span>}
        </div>
        {/* 탭 스크롤 */}
        <div style={{display:"flex",gap:6,overflowX:"auto",marginTop:12}}>
          {TABS.map(([id,ic,label])=>(
            <button key={id} onClick={()=>{ if(id==="chart"){ window.open(CHART_URL,"_blank"); } else { setTab(id); } }} style={{flexShrink:0,padding:"7px 12px",borderRadius:18,border:"none",
              background:tab===id?"#fff":"rgba(255,255,255,0.22)",color:tab===id?"#2f6fb5":"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              {ic} {label}
            </button>
          ))}
        </div>
        </div>
      </div>

      <div style={{maxWidth:480,margin:"0 auto",padding:"14px 14px"}}>
        {loading && <div style={{textAlign:"center",color:C.gray,padding:"40px 0"}}>바다 데이터 불러오는 중…</div>}
        {!loading && isSample && (
          <div style={{background:"rgba(201,138,0,0.15)",border:`1px solid ${C.amber}`,borderRadius:12,padding:"10px 14px",marginBottom:12,fontSize:12,color:C.gold,lineHeight:1.5}}>
            📌 미리보기 모드 — 지금은 <b>예시 데이터</b>로 화면을 보여드려요. 실제 앱에선 이 자리에 실시간 날씨·수온·파고가 들어갑니다.
          </div>
        )}

        {/* ═══ 기상특보 배너 (모든 탭 공통) ═══ */}
        {!loading && data && marineAlert && (
          <div style={{background:marineAlert.bg,border:`1.5px solid ${marineAlert.color}`,borderRadius:12,padding:"11px 14px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>{marineAlert.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:800,color:marineAlert.color}}>
                  {marineAlert.label} · {region.name}
                </div>
                <div style={{fontSize:12,color:C.text,marginTop:2}}>{marineAlert.msg}</div>
              </div>
            </div>
            <a href="https://www.weather.go.kr/w/weather/warning/status.do" target="_blank" rel="noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:9,padding:"9px 0",
              borderRadius:9,background:marineAlert.color,color:"#fff",fontSize:13,fontWeight:800,textDecoration:"none"}}>
              🛰️ 기상청 공식 특보 확인하기 ›
            </a>
            <div style={{fontSize:10.5,color:C.gray,marginTop:7,lineHeight:1.5}}>
              ※ 위 등급은 앱 예보값 기준 <b>자체 안전등급</b>이에요. 실제 발효 특보는 기상청에서 확인하세요.
            </div>
          </div>
        )}
        {!loading && data && !marineAlert && (
          <div style={{background:"rgba(31,157,85,0.12)",border:`1px solid #1f9d55`,borderRadius:12,padding:"11px 14px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:17}}>✅</span>
              <div style={{flex:1}}>
                <span style={{fontSize:13,color:"#1f9d55",fontWeight:800}}>기상특보 없음 · {region.name}</span>
                <span style={{fontSize:12,color:C.gray,marginLeft:6}}>바람·물결 양호</span>
              </div>
            </div>
            <a href="https://www.weather.go.kr/w/weather/warning/status.do" target="_blank" rel="noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:9,padding:"8px 0",
              borderRadius:9,background:"rgba(31,157,85,0.15)",color:"#1f7d45",fontSize:12.5,fontWeight:700,textDecoration:"none",border:"1px solid rgba(31,157,85,0.4)"}}>
              🛰️ 기상청 공식 특보 지도 보기 ›
            </a>
          </div>
        )}

        {/* ═══ 바다예보 (종합 대시보드) ═══ */}
        {!loading && data && data.w && tab==="forecast" && (
          <>
            {score&&(
              <div style={{background:score.bg,border:`1.5px solid ${score.color}55`,borderRadius:16,padding:"15px 18px",marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:32}}>{score.emoji}</div>
                <div><div style={{fontSize:12,color:score.fg,opacity:.85}}>오늘 {region.name} 낚시 조건</div><div style={{fontSize:21,fontWeight:800,color:score.fg}}>{score.label}</div></div>
              </div>
            )}
            {/* 요약 (날씨·바람파고) */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <Mini icon={wxEmoji} label="날씨" main={cur?`${cur.temperature_2m.toFixed(0)}°`:"-"} sub={wxText}/>
              <Mini icon="💨" label="바람·파고" main={cur?`${cur.wind_speed_10m.toFixed(1)}m/s`:"-"} sub={waveH!=null?`파고 ${waveH.toFixed(1)}m`:""}/>
            </div>
            {/* 수심별 수온 요약 */}
            {(seaTemp!=null)&&(
              <Card title="🌊 수심별 수온">
                <div style={{display:"flex",gap:8}}>
                  <DepthTemp label="표층 0m" temp={seaTemp} note="찌·표층" C={C}/>
                  <DepthTemp label="수심 20m" temp={seaTemp20} note="중층" C={C}/>
                  <DepthTemp label="수심 50m" temp={seaTemp50} note="바닥·선상" C={C}/>
                </div>
                <div style={{fontSize:10,color:C.gray,marginTop:8}}>※ 심층 수온은 해양모델 추정값 · 바닥 어종(우럭·광어·문어) 참고용</div>
              </Card>
            )}
            {/* 오늘 조석 미리보기 */}
            <Card title="🌙 오늘 물때">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {tides.map((t,i)=>(
                  <div key={i} style={{background:C.card2,borderRadius:10,padding:"9px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:13,color:t.type==="만조"?C.blue:C.gray}}>{t.type==="만조"?"▲ 만조":"▼ 간조"}</span>
                    <span style={{fontSize:15,fontWeight:700}}>{t.time}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:10,fontSize:12,color:C.gray,display:"flex",gap:14}}>
                <span>🌅 일출 {sun.sunrise}</span><span>🌇 일몰 {sun.sunset}</span>
              </div>
            </Card>
            {/* 5일 예보 */}
            {data.w.daily&&(
              <Card title="📅 5일 예보">
                {data.w.daily.time.map((d,i)=>{
                  const [txt,em]=WMO[data.w.daily.weather_code[i]]||["","🌡️"];const dt=new Date(d);
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",padding:"9px 0",borderBottom:i<4?`1px solid ${C.border}`:"none"}}>
                      <span style={{width:52,fontSize:13,color:C.gray}}>{i===0?"오늘":`${dt.getMonth()+1}/${dt.getDate()}`}</span>
                      <span style={{fontSize:20,width:34}}>{em}</span>
                      <span style={{flex:1,fontSize:13,color:C.gray}}>{txt}</span>
                      <span style={{fontSize:12,color:C.blue,width:60}}>💨{data.w.daily.wind_speed_10m_max[i].toFixed(0)}m/s</span>
                      <span style={{fontSize:13,width:64,textAlign:"right"}}>
                        <span style={{color:"#e57373"}}>{data.w.daily.temperature_2m_max[i].toFixed(0)}°</span>
                        <span style={{color:"#64b5f6",marginLeft:4}}>{data.w.daily.temperature_2m_min[i].toFixed(0)}°</span>
                      </span>
                    </div>
                  );
                })}
              </Card>
            )}

            {/* 의견 보내기 */}
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdTFFDbP8ea5PPispIY3bhboCjrlZifUfsRZRydx5EsKnx8aQ/viewform?usp=header" target="_blank" rel="noopener"
              style={{display:"block",textDecoration:"none",marginTop:4}}>
              <div style={{background:"linear-gradient(135deg,#3a90cf,#1f6fb2)",borderRadius:16,padding:"16px 18px",border:"none",display:"flex",alignItems:"center",gap:12,boxShadow:"0 3px 10px rgba(31,111,178,0.2)"}}>
                <span style={{fontSize:28}}>💬</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>의견 · 개선 요청 보내기</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.9)",marginTop:2}}>이런 기능 있으면 좋겠다 · 이 정보가 틀렸다 — 알려주세요 🎣</div>
                </div>
                <span style={{fontSize:18,color:"rgba(255,255,255,0.9)"}}>›</span>
              </div>
            </a>
            <div style={{fontSize:11,color:C.gray,textAlign:"center",marginTop:8,lineHeight:1.6}}>
              여러분의 의견이 '바다조황'을 완성합니다. 낚시꾼이 만드는 낚시 앱이에요.
            </div>
          </>
        )}
        {/* ═══ 바람·파고 (날짜별: 3일 2시간 상세, 이후 오전/오후) ═══ */}
        {!loading && data && data.w && data.w.hourly && tab==="wind" && (
          <>
            <div style={{fontSize:13,color:C.gray,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <span>3일까지는 2시간 단위 상세, 이후는 오전/오후 · 최대 7일</span>
              <button onClick={()=>setRegion({...region})} style={{marginLeft:"auto",padding:"5px 12px",borderRadius:14,border:"none",background:C.card,color:C.lblue,fontSize:12,fontWeight:700,cursor:"pointer"}}>🔄 새로고침</button>
            </div>
            {(()=>{
              const H=data.w.hourly, M=data.m?.hourly;
              // 시간 인덱스를 날짜별로 그룹핑
              const byDate={};
              H.time.forEach((t,i)=>{
                const dt=new Date(t);
                const key=`${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
                if(!byDate[key]) byDate[key]={dt,idxs:[]};
                byDate[key].idxs.push(i);
              });
              const dateKeys=Object.keys(byDate).slice(0,7);
              const todayKey=`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
              const days=["일","월","화","수","목","금","토"];
              return dateKeys.map((key,di)=>{
                const {dt,idxs}=byDate[key];
                const isToday=key===todayKey;
                const label=isToday?"오늘":di===1?"내일":di===2?"모레":`${dt.getMonth()+1}/${dt.getDate()}`;
                const detailed=di<=2; // 오늘·내일·모레 3일은 2시간 단위 상세

                return(
                  <Card key={key} title={`${label} (${days[dt.getDay()]}) · ${dt.getMonth()+1}월 ${dt.getDate()}일`}>
                    <div style={{display:"grid",gridTemplateColumns:"58px 1fr 1fr 60px",gap:4,fontSize:11,color:C.gray,paddingBottom:7,borderBottom:`1px solid ${C.border}`,fontWeight:700}}>
                      <span>시각</span><span style={{textAlign:"center"}}>풍향</span><span style={{textAlign:"center"}}>풍속</span><span style={{textAlign:"right"}}>파고</span>
                    </div>
                    {detailed
                      ? idxs.filter((_,k)=>new Date(H.time[idxs[k]]).getHours()%2===0).map(i=>{
                          const hh=new Date(H.time[i]).getHours();
                          const ws=H.wind_speed_10m[i], wd=H.wind_direction_10m[i], wh=M?.wave_height?.[i];
                          const strong=ws>=8;
                          return(
                            <div key={i} style={{display:"grid",gridTemplateColumns:"58px 1fr 1fr 60px",gap:4,alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                              <span style={{fontSize:13,color:hh>=18||hh<6?C.gold:C.text}}>{String(hh).padStart(2,"0")}시</span>
                              <span style={{textAlign:"center",fontSize:14,fontWeight:700,color:C.blue}}>{windArrow(wd)} {windDir(wd)}</span>
                              <span style={{textAlign:"center",fontSize:14,fontWeight:700,color:strong?"#e57373":C.text}}>{ws.toFixed(1)}</span>
                              <span style={{textAlign:"right",fontSize:13,color:wh>=1.5?"#e57373":C.blue}}>{wh!=null?`${wh.toFixed(1)}m`:"-"}</span>
                            </div>
                          );
                        })
                      : ["오전","오후"].map((half,hi)=>{
                          // 오전=6~11시, 오후=12~17시 대표값
                          const range=hi===0?idxs.filter(i=>{const h=new Date(H.time[i]).getHours();return h>=6&&h<12;})
                                              :idxs.filter(i=>{const h=new Date(H.time[i]).getHours();return h>=12&&h<18;});
                          if(range.length===0) return null;
                          const avg=arr=>arr.reduce((a,b)=>a+b,0)/arr.length;
                          const ws=avg(range.map(i=>H.wind_speed_10m[i]));
                          const wd=range.map(i=>H.wind_direction_10m[i])[Math.floor(range.length/2)];
                          const whs=range.map(i=>M?.wave_height?.[i]).filter(v=>v!=null);
                          const wh=whs.length?avg(whs):null;
                          const strong=ws>=8;
                          return(
                            <div key={hi} style={{display:"grid",gridTemplateColumns:"58px 1fr 1fr 60px",gap:4,alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                              <span style={{fontSize:13,color:C.lblue,fontWeight:700}}>{half}</span>
                              <span style={{textAlign:"center",fontSize:14,fontWeight:700,color:C.blue}}>{windArrow(wd)} {windDir(wd)}</span>
                              <span style={{textAlign:"center",fontSize:14,fontWeight:700,color:strong?"#e57373":C.text}}>{ws.toFixed(1)}</span>
                              <span style={{textAlign:"right",fontSize:13,color:wh>=1.5?"#e57373":C.blue}}>{wh!=null?`${wh.toFixed(1)}m`:"-"}</span>
                            </div>
                          );
                        })}
                  </Card>
                );
              });
            })()}
            <div style={{fontSize:11,color:C.gray,marginTop:2,marginBottom:10,lineHeight:1.6,padding:"0 4px"}}>
              <span style={{color:C.gold}}>노란 시각</span> = 밤 · <span style={{color:"#e57373"}}>빨간 값</span> = 풍속 8m/s↑ 또는 파고 1.5m↑ (출조 주의)<br/>
              화살표 = 바람 부는 방향 · 풍속 m/s · 앱 열 때마다 최신 데이터 자동 갱신
            </div>
          </>
        )}

        {/* ═══ 날씨 (시간별) ═══ */}
        {!loading && data && data.w && tab==="weather" && cur && (
          <>
            <Card title="⛅ 현재 날씨">
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <span style={{fontSize:46}}>{wxEmoji}</span>
                <div><div style={{fontSize:36,fontWeight:800}}>{cur.temperature_2m.toFixed(0)}°</div><div style={{fontSize:13,color:C.gray}}>{wxText}</div></div>
                <div style={{marginLeft:"auto",textAlign:"right",fontSize:13,color:C.gray,lineHeight:1.8}}>
                  체감 {cur.apparent_temperature.toFixed(0)}°<br/>습도 {cur.relative_humidity_2m}%<br/>강수 {cur.precipitation}mm
                </div>
              </div>
            </Card>
            <div style={{fontSize:13,color:C.gray,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <span>3일까지는 2시간 단위 상세, 이후는 오전/오후 · 최대 7일</span>
              <button onClick={()=>setRegion({...region})} style={{marginLeft:"auto",padding:"5px 12px",borderRadius:14,border:"none",background:C.card,color:C.lblue,fontSize:12,fontWeight:700,cursor:"pointer"}}>🔄 새로고침</button>
            </div>
            {(()=>{
              const H=data.w.hourly;
              const byDate={};
              H.time.forEach((t,i)=>{
                const dt=new Date(t);
                const key=`${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
                if(!byDate[key]) byDate[key]={dt,idxs:[]};
                byDate[key].idxs.push(i);
              });
              const dateKeys=Object.keys(byDate).slice(0,7);
              const todayKey=`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
              const days=["일","월","화","수","목","금","토"];
              return dateKeys.map((key,di)=>{
                const {dt,idxs}=byDate[key];
                const label=key===todayKey?"오늘":di===1?"내일":di===2?"모레":`${dt.getMonth()+1}/${dt.getDate()}`;
                const detailed=di<=2;
                return(
                  <Card key={key} title={`${label} (${days[dt.getDay()]}) · ${dt.getMonth()+1}월 ${dt.getDate()}일`}>
                    {detailed ? (
                      <>
                        <div style={{display:"grid",gridTemplateColumns:"58px 44px 1fr 1fr 56px",gap:4,fontSize:11,color:C.gray,paddingBottom:7,borderBottom:`1px solid ${C.border}`,fontWeight:700}}>
                          <span>시각</span><span style={{textAlign:"center"}}>날씨</span><span>상태</span><span style={{textAlign:"right"}}>기온</span><span style={{textAlign:"right"}}>강수</span>
                        </div>
                        {idxs.filter(i=>new Date(H.time[i]).getHours()%2===0).map(i=>{
                          const hh=new Date(H.time[i]).getHours();
                          const [txt,em]=WMO[H.weather_code[i]]||["","🌡️"];
                          const pop=H.precipitation_probability?.[i]??0;
                          return(
                            <div key={i} style={{display:"grid",gridTemplateColumns:"58px 44px 1fr 1fr 56px",gap:4,alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                              <span style={{fontSize:13,color:hh>=18||hh<6?C.gold:C.text}}>{String(hh).padStart(2,"0")}시</span>
                              <span style={{fontSize:20,textAlign:"center"}}>{em}</span>
                              <span style={{fontSize:12,color:C.gray}}>{txt}</span>
                              <span style={{fontSize:15,fontWeight:700,textAlign:"right"}}>{H.temperature_2m[i].toFixed(0)}°</span>
                              <span style={{fontSize:12,color:pop>=50?"#5a9de0":C.blue,textAlign:"right"}}>💧{pop}%</span>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div style={{display:"flex",gap:10}}>
                        {["오전","오후"].map((half,hi)=>{
                          const range=hi===0?idxs.filter(i=>{const h=new Date(H.time[i]).getHours();return h>=6&&h<12;})
                                              :idxs.filter(i=>{const h=new Date(H.time[i]).getHours();return h>=12&&h<18;});
                          if(range.length===0) return null;
                          const mid=range[Math.floor(range.length/2)];
                          const [txt,em]=WMO[H.weather_code[mid]]||["","🌡️"];
                          const avg=arr=>arr.reduce((a,b)=>a+b,0)/arr.length;
                          const temp=avg(range.map(i=>H.temperature_2m[i]));
                          const pop=Math.max(...range.map(i=>H.precipitation_probability?.[i]??0));
                          return(
                            <div key={hi} style={{flex:1,background:C.card2,borderRadius:12,padding:"12px",textAlign:"center"}}>
                              <div style={{fontSize:12,color:C.lblue,fontWeight:700}}>{half}</div>
                              <div style={{fontSize:26,margin:"4px 0"}}>{em}</div>
                              <div style={{fontSize:12,color:C.gray}}>{txt}</div>
                              <div style={{fontSize:15,fontWeight:700,marginTop:2}}>{temp.toFixed(0)}°</div>
                              <div style={{fontSize:11,color:C.blue,marginTop:2}}>💧{pop}%</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                );
              });
            })()}
            <div style={{fontSize:11,color:C.gray,marginTop:2,marginBottom:10,lineHeight:1.6,padding:"0 4px"}}>
              💧 = 강수확률 · <span style={{color:C.gold}}>노란 시각</span> = 밤 · 앱 열 때마다 최신 데이터 자동 갱신
            </div>
          </>
        )}

        {/* ═══ 물때 (조석 그래프) — API 없이 계산으로 작동 ═══ */}
        {!loading && tab==="tide" && (
          <>
            <Card title={`🌙 ${region.name} 물때 · 조석`}>
              <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:4}}>
                <span style={{fontSize:30,fontWeight:800,color:C.blue}}>{mt.name}</span>
                <span style={{fontSize:16,color:C.amber,fontWeight:700}}>{mt.strength}</span>
                <span style={{marginLeft:"auto",fontSize:12,color:C.gray}}>음력 {mt.lunarDay}일</span>
              </div>
              <div style={{marginBottom:14}}>{[1,2,3,4,5].map(n=><span key={n} style={{display:"inline-block",width:26,height:6,borderRadius:3,marginRight:4,background:n<=mt.level?C.blue:C.border}}/>)}</div>
              {(()=>{
                const fp=currentFlowPct(mt.level, waveH, cur?.wind_speed_10m);
                const col=fp>=80?"#e57373":fp>=50?C.gold:fp>=25?C.lblue:C.gray;
                const desc=fp>=80?"매우 강함 (주의)":fp>=50?"강함":fp>=25?"보통":fp>=10?"약함":"잔잔";
                return(
                  <div style={{background:C.card2,borderRadius:10,padding:"11px 13px",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,color:C.gray}}>🌊 오늘 조류 세기</span>
                      <span style={{fontSize:24,fontWeight:900,color:col,marginLeft:"auto"}}>{fp}%</span>
                      <span style={{fontSize:12,color:col,fontWeight:700,width:72,textAlign:"right"}}>{desc}</span>
                    </div>
                    <div style={{marginTop:8,height:7,background:C.border,borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:`${fp}%`,height:"100%",background:col,borderRadius:4}}/>
                    </div>
                    <div style={{fontSize:10.5,color:C.gray,marginTop:6}}>물때({mt.strength}) + 파고 + 바람 종합 · 100%=가장 센 상태</div>
                  </div>
                );
              })()}
              <TideGraph tides={tides} sun={sun}/>
            </Card>
            <Card title="📋 조석 시각표 (3일)">
              <div style={{display:"flex",alignItems:"center",fontSize:10.5,color:C.gray,paddingBottom:6,marginBottom:2,borderBottom:`1px solid ${C.border}`,fontWeight:700}}>
                <span style={{width:66}}>구분</span><span style={{flex:1}}>시각</span><span style={{width:60,textAlign:"right"}}>조위</span>
              </div>
              {Array.from({length:3}).map((_,d)=>{
                const day=new Date(today.getFullYear(),today.getMonth(),today.getDate()+d);
                const dtides=getTides(day);
                const dsun=sunTimes(day,region.lat);
                const dmt=getMulttae(day);
                const days=["일","월","화","수","목","금","토"];
                const label=d===0?"오늘":d===1?"내일":"모레";
                return(
                  <div key={d} style={{marginBottom:d<2?14:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>
                      <span style={{fontSize:13,fontWeight:800,color:d===0?C.gold:C.text}}>{label} {day.getMonth()+1}/{day.getDate()}({days[day.getDay()]})</span>
                      <span style={{fontSize:12,color:C.blue,fontWeight:700}}>{dmt.name}</span>
                      <span style={{fontSize:11,color:C.amber}}>{dmt.strength}</span>
                    </div>
                    {dtides.map((t,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",padding:"8px 0",borderBottom:i<3?`1px solid rgba(30,58,82,0.5)`:"none"}}>
                        <span style={{fontSize:14,color:t.type==="만조"?C.blue:C.gray,fontWeight:700,width:66}}>{t.type==="만조"?"▲ 만조":"▼ 간조"}</span>
                        <span style={{fontSize:18,fontWeight:800,flex:1}}>{t.time}</span>
                        <span style={{fontSize:12,color:C.gray,width:60,textAlign:"right"}}>{t.level}cm</span>
                      </div>
                    ))}
                    <div style={{marginTop:6,fontSize:12,color:C.lblue,display:"flex",alignItems:"center",gap:6}}>
                      🌊 조류 세기 <b style={{color:tideOnlyPct(dmt.level)>=50?C.gold:C.lblue}}>
                        {d===0?currentFlowPct(dmt.level,waveH,cur?.wind_speed_10m):tideOnlyPct(dmt.level)}%
                      </b>
                      <span style={{fontSize:11,color:C.gray}}>{d===0?"(오늘·파고/바람 반영)":"(물때 기준)"}</span>
                    </div>
                    <div style={{marginTop:6,fontSize:12,color:C.gray,display:"flex",gap:16}}>
                      <span>🌅 일출 {dsun.sunrise}</span><span>🌇 일몰 {dsun.sunset}</span>
                    </div>
                  </div>
                );
              })}
            </Card>

            {/* 물때표 (계산값이라 길게 가능) */}
            <Card title="📅 물때표">
              {Array.from({length:30}).map((_,d)=>{
                const day=new Date(today.getFullYear(),today.getMonth(),today.getDate()+d);
                const dmt=getMulttae(day);
                const dtides=getTides(day);
                const days=["일","월","화","수","목","금","토"];
                const isToday=d===0;
                return(
                  <div key={d} style={{padding:"10px 0",borderBottom:d<29?`1px solid ${C.border}`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:13,fontWeight:700,color:isToday?C.gold:C.text,width:80}}>
                        {isToday?"오늘 ":""}{day.getMonth()+1}/{day.getDate()}({days[day.getDay()]})
                      </span>
                      <span style={{fontSize:13,fontWeight:700,color:C.blue}}>{dmt.name}</span>
                      <span style={{fontSize:12,color:C.amber}}>{dmt.strength}</span>
                      {(()=>{
                        const fp=isToday?currentFlowPct(dmt.level,waveH,cur?.wind_speed_10m):tideOnlyPct(dmt.level);
                        const col=fp>=60?"#d9554a":fp>=40?C.amber:C.lblue;
                        return <span style={{fontSize:12,fontWeight:800,color:col}}>🌊{fp}%</span>;
                      })()}
                      <span style={{marginLeft:"auto"}}>
                        {[1,2,3,4,5].map(n=><span key={n} style={{display:"inline-block",width:12,height:5,borderRadius:2,marginLeft:2,background:n<=dmt.level?C.blue:C.border}}/>)}
                      </span>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8,paddingLeft:2}}>
                      {dtides.map((t,i)=>(
                        <span key={i} style={{fontSize:12,color:t.type==="만조"?C.blue:C.gray}}>
                          {t.type==="만조"?"▲":"▼"}{t.time}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div style={{fontSize:11,color:C.gray,marginTop:10,lineHeight:1.5}}>▲ 만조 · ▼ 간조 · 물때는 계산값이라 날짜 무제한 조회 가능</div>
            </Card>
            <div style={{fontSize:11,color:C.gray,textAlign:"center",lineHeight:1.6}}>🌊 조류 세기 = 물때+파고+바람 종합 물 상태 (0~100%) · 평상시 사리 70%, 잔잔하면 한 자릿수, 태풍급 100%<br/>※ 조석 시각·조위·조류세기는 근사 계산값 · 실제 앱은 국립해양조사원 관측소 정밀값 연동</div>
          </>
        )}

        {/* ═══ 포인트 (지도·해도 링크) ═══ */}
        {!loading && tab==="point" && (
          <>
            <div style={{fontSize:13,color:C.gray,marginBottom:12,lineHeight:1.6}}>낚시에 필요한 지도·해도·실측 정보를 바로 연결해요.</div>

            {/* 지도·해도 링크 (2열 그리드로 한눈에) */}
            <Card title="🗺️ 지도 · 해도 바로가기">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {emoji:"🌊",title:"전자해도 (KHOA)",desc:"국립해양조사원 · 수심·등수심선",url:"https://www.khoa.go.kr/oceanmap/main.do"},
                  {emoji:"💨",title:"Windy 바람지도",desc:"바람·파도 지도 앱 · 선택 지역 위치로 열림",url:`https://www.windy.com/?${region.lat},${region.lon},9`},
                  {emoji:"🌡️",title:"실시간 수온 (수심별)",desc:"국립해양조사원 관측소 · 표층~수심별 실측 수온",url:"https://www.khoa.go.kr/koofs/kor/observation/obs_real.do"},
                  {emoji:"🌊",title:"실시간 어장 수온",desc:"국립수산과학원 · 연안 양식장 관측",url:"https://www.nifs.go.kr/risa/main.risa"},
                  {emoji:"⛅",title:"기상청 해상예보",desc:"해상 예보·특보",url:"https://www.weather.go.kr/w/ocean/marine/forecast.do"},
                ].map((L,i)=>(
                  <a key={i} href={L.url} target="_blank" rel="noopener" style={{display:"block",background:C.card2,borderRadius:12,padding:"14px 12px",textDecoration:"none",color:C.text,border:`1px solid ${C.border}`}}>
                    <div style={{fontSize:24}}>{L.emoji}</div>
                    <div style={{fontSize:14,fontWeight:700,marginTop:6,color:C.blue}}>{L.title}</div>
                    <div style={{fontSize:11,color:C.gray,marginTop:2}}>{L.desc}</div>
                  </a>
                ))}
              </div>
              <div style={{fontSize:11,color:C.gray,marginTop:10}}>외부 사이트로 연결됩니다 · 정밀 수심(등수심선)은 전자해도에서 확대해 확인</div>
            </Card>

            {/* 대표 포인트 (향후 확장) */}
            <Card title="📍 대표 포인트">
              <div style={{fontSize:13,color:C.gray,lineHeight:1.7}}>
                실제 출시 앱에서는 이 자리에 낚시 포인트 목록이 쌓입니다.<br/>
                포인트별 <b style={{color:C.blue}}>수심 · 바닥지질 · 적정물때 · 조과후기</b>를 표시할 예정입니다.
              </div>
            </Card>
          </>
        )}
      </div>

      {/* 하단 탭바 (주요 4개 고정) */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.97)",borderTop:`1px solid ${C.border}`,display:"flex",maxWidth:480,margin:"0 auto",boxShadow:"0 -2px 10px rgba(31,111,178,0.08)"}}>
        {[["forecast","🌊","예보"],["tide","🌙","물때"],["chart","🗺️","전자해도"],["point","📍","포인트"]].map(([id,ic,label])=>(
          <button key={id} onClick={()=>{ if(id==="chart"){ window.open(CHART_URL,"_blank"); } else { setTab(id); } }} style={{flex:1,padding:"10px 0 13px",background:"none",border:"none",cursor:"pointer",color:tab===id?C.blue:C.gray,borderTop:tab===id?`2px solid ${C.blue}`:"2px solid transparent"}}>
            <div style={{fontSize:19}}>{ic}</div><div style={{fontSize:11,fontWeight:700,marginTop:2}}>{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 조각 컴포넌트 ──
function Card({title,children}){return(
  <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:12,border:`1px solid ${C.border}`,boxShadow:"0 2px 8px rgba(31,111,178,0.06)"}}>
    {title&&<div style={{fontSize:13,color:C.lblue,fontWeight:700,marginBottom:12}}>{title}</div>}
    {children}
  </div>
);}
function Mini({icon,label,main,sub,gold}){return(
  <div style={{background:C.card,borderRadius:14,padding:"13px 14px",border:`1px solid ${C.border}`,boxShadow:"0 2px 8px rgba(31,111,178,0.06)"}}>
    <div style={{fontSize:11,color:C.gray}}>{icon} {label}</div>
    <div style={{fontSize:24,fontWeight:800,color:gold?C.gold:C.text,marginTop:4}}>{main}</div>
    {sub&&<div style={{fontSize:11,color:gold?C.gold:C.gray,marginTop:2}}>{sub}</div>}
  </div>
);}
function DepthTemp({label,temp,note,C}){
  // 수온에 따라 색: 따뜻할수록 붉게, 차가울수록 파랗게
  const col=temp==null?"#9db3c4":temp>=22?"#d9554a":temp>=17?"#c78a1e":temp>=12?"#1f6fb2":"#3a7bc0";
  return(
    <div style={{flex:1,background:C.card2,borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
      <div style={{fontSize:11,color:C.lblue,fontWeight:700}}>{label}</div>
      <div style={{fontSize:24,fontWeight:800,color:col,marginTop:4}}>{temp!=null?temp.toFixed(1):"-"}°</div>
      <div style={{fontSize:10,color:C.gray,marginTop:3}}>{note}</div>
    </div>
  );
}
function Row({label,value,note,highlight}){return(
  <div style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:12}}>
      <span style={{fontSize:13,color:C.lblue,fontWeight:700,flexShrink:0}}>{label}</span>
      <span style={{fontSize:14,fontWeight:700,textAlign:"right",color:highlight?"#1f9d55":C.text}}>{value}</span>
    </div>
    {note&&<div style={{fontSize:11,color:C.gray,marginTop:4,textAlign:"right"}}>{note}</div>}
  </div>
);}

// ── 세로 조석 그래프 (참고 앱 이미지8 스타일: 위→아래 0~24시) ──
function TideGraph({tides,sun}){
  const W=320, H=420, padT=20, padB=20;
  const axisX=150;               // 세로 시간축 위치
  const usableH=H-padT-padB;
  const yFor=hour=>padT+(hour/24)*usableH;   // 시각 → y좌표
  const maxL=Math.max(...tides.map(t=>t.level),600);
  const minL=Math.min(...tides.map(t=>t.level),0);
  // 조위 → x축 편차 (만조는 오른쪽으로, 간조는 왼쪽으로 곡선이 휘게)
  const xFor=level=>{
    const norm=(level-minL)/(maxL-minL||1);   // 0~1
    return axisX + (norm-0.5)*180;            // 축 기준 좌우로
  };
  const pts=tides.map(t=>({x:xFor(t.level),y:yFor(t.hour),...t}));
  // 부드러운 세로 곡선
  let path=`M ${axisX} ${padT}`;
  const first={x:axisX,y:padT};
  let prev=first;
  for(const p of pts){
    const cy=(prev.y+p.y)/2;
    path+=` Q ${prev.x} ${cy} ${p.x} ${p.y}`;
    prev=p;
  }
  path+=` Q ${prev.x} ${(prev.y+(H-padB))/2} ${axisX} ${H-padB}`;

  // 시간 눈금 (0,3,6...24)
  const ticks=[0,3,6,9,12,15,18,21,24];
  const sunriseH=parseInt(sun.sunrise.slice(0,2))+parseInt(sun.sunrise.slice(3))/60;
  const sunsetH=parseInt(sun.sunset.slice(0,2))+parseInt(sun.sunset.slice(3))/60;

  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",maxHeight:460}}>
      <defs>
        <linearGradient id="tideGradV" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d6ebf8"/><stop offset="100%" stopColor="#1f6fb2"/>
        </linearGradient>
      </defs>

      {/* 낮 시간대 음영 (일출~일몰) */}
      <rect x="0" y={yFor(sunriseH)} width={W} height={yFor(sunsetH)-yFor(sunriseH)} fill="#4a9de0" opacity="0.05"/>

      {/* 세로 시간축 */}
      <line x1={axisX} y1={padT} x2={axisX} y2={H-padB} stroke="#c5dced" strokeWidth="1"/>
      {ticks.map(h=>(
        <g key={h}>
          <line x1={axisX-4} y1={yFor(h)} x2={axisX+4} y2={yFor(h)} stroke="#c5dced" strokeWidth="1"/>
          <text x={axisX-10} y={yFor(h)+3} fill="#5f7c92" fontSize="10" textAnchor="end">{h}</text>
        </g>
      ))}

      {/* 조석 곡선 */}
      <path d={path} fill="none" stroke="#1f6fb2" strokeWidth="2.5"/>

      {/* 일출/일몰 마커 */}
      <g>
        <text x={W-8} y={yFor(sunriseH)+4} fill="#c07a00" fontSize="11" textAnchor="end">🌅 {sun.sunrise}</text>
        <text x={W-8} y={yFor(sunsetH)+4} fill="#d9662a" fontSize="11" textAnchor="end">🌇 {sun.sunset}</text>
      </g>

      {/* 만조/간조 박스 (참고 앱처럼 좌우로) */}
      {pts.map((p,i)=>{
        const isHigh=p.type==="만조";
        const boxW=64, boxH=34;
        const boxX=isHigh ? p.x+8 : p.x-boxW-8;   // 만조 오른쪽, 간조 왼쪽
        const bx=Math.max(2,Math.min(W-boxW-2,boxX));
        return(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill={isHigh?"#e05555":"#1f6fb2"} stroke="#ffffff" strokeWidth="1.5"/>
            <rect x={bx} y={p.y-boxH/2} width={boxW} height={boxH} rx="6" fill={isHigh?"#fdeaea":"#eaf5fc"} stroke={isHigh?"#e05555":"#1f6fb2"} strokeWidth="1"/>
            <text x={bx+boxW/2} y={p.y-3} fill={isHigh?"#c0392b":"#1f6fb2"} fontSize="10" textAnchor="middle" fontWeight="700">{isHigh?"▲만조":"▼간조"} {p.time}</text>
            <text x={bx+boxW/2} y={p.y+11} fill="#5f7c92" fontSize="9" textAnchor="middle">{p.level}cm</text>
          </g>
        );
      })}

      {/* 상단/하단 라벨 */}
      <text x={axisX} y={padT-6} fill="#5f7c92" fontSize="9" textAnchor="middle">0시</text>
      <text x={axisX} y={H-padB+14} fill="#5f7c92" fontSize="9" textAnchor="middle">24시</text>
    </svg>
  );
}
