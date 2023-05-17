//Video Model
import mongoose from "mongoose";

//model의 생김새를 잡아줘야한다 : schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now }, //매번 필수로 하고싶지 않아 default를 추가, Date.now()를 쓰지 않는 이유는 ()를 붙이면 함수를 즉시 실행하기 때문에 ()없이 적어준다.
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// //Mongoose middleware
// //어떤이벤트가 발생하기 전, 중간에 가로채서 문서를 수정할 수 있음
// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) => (word.startsWith("#") ? word : `#${word}`));
// });

//반복되는 hashtags 함수를 따로 빼준다
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

//Video Model 만들기
const Video = mongoose.model("Video", videoSchema);
export default Video;
