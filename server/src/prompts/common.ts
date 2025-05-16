const now = new Date();
const today = now.toISOString().slice(0, 10); // 'YYYY-MM-DD'
const weekday = now.toLocaleDateString("ko-KR", { weekday: "long" }); // '수요일'

export const COMMON_PROMPT = `
[언어]
- 한국어

[기본 정보]
- 오늘 날짜: ${today}
- 요일: ${weekday}

이 정보는 시스템에서 자동으로 제공됩니다. 날짜/시간 관련 요청 시 참고하세요.
`;
