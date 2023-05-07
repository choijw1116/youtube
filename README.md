# youtube

크게 두가지의 데이터가 있다.

1. 비디오
2. user

# global Router

/ -> Home
/join -> 회원가입
/login -> 로그인
/search -> 검색

# Users Router

/users/:id -> 프로필 보기
/users/logout -> 로그아웃
/users/edit -> 프로필 수정
/users/delete -> 프로필 삭제

# Videos Router

/videos/:id -> 비디오 시청
/videos/upload -> 비디오 업로드
/videos/:id/edit -> 동영상 수정
/videos/:id/delete -> 동영상 삭제

/videos/comments -> 동영상 댓글
/videos/comments/delete -> 동영상 댓글 삭제

라우터를 도메인 별로 나누자. 라우터는 작업중인 주제를 기반으로 URL을 그룹화해준다
