import QuestionIcon from "@/assets/icons/question_filled.svg";
import PuzzleIcon from "@/assets/icons/puzzle.svg";
import WalkingIcon from "@/assets/icons/walking_man.svg";

export const CONTENTS = [
  {
    key: "karlatornet",
    pre: {
      icon: WalkingIcon,
      title: "Walk to the marked location",
      body: "Follow the path to reach your first location.",
      distanceLabel: "Distance remaining",
    },
    overlay: { text: "Unlock the location" },
    task: {
      Icon: QuestionIcon,
      title: "Karlatornet",
      body: "In 60 seconds, try to create a “living tower” together that will symbolize Karlatornet. Everyone in the group needs to be involved.",
      doneLabel: "Done",
    },
    congrats: {
      Icon: PuzzleIcon,
      title: "Congratulations!",
      body: "You’re first quest was successful and you’ve collected a new Puzzle Piece. Head to your next location to discover more of Lindholmen!",
      nextLabel: "Next location",
    },
  },
  {
    key: "kuggen",
    pre: {
      title: "Walk to the marked location",
      body: "Follow the path to reach your next location.",
      distanceLabel: "Distance remaining",
    },
    overlay: { text: "Unlock this stop" },
    task: {
      Icon: QuestionIcon,
      title: "Kuggen",
      body: "Stand in a circle. The first person does a movement, the next repeats it and adds a new one. Continue until everyone has contributed, and then do the whole chain together.",
      doneLabel: "Done",
    },
    congrats: {
      Icon: PuzzleIcon,
      title: "Congratulations!",
      body: "You’re second quest was successful and you’ve collected another Puzzle Piece. Head to the next location!",
      nextLabel: "Next location",
    },
  },
  {
    key: "lindholmspiren",
    pre: {
      title: "Walk to the marked location",
      body: "Follow the path to reach your next location.",
      distanceLabel: "Distance remaining",
    },
    overlay: { text: "Unlock the location" },
    task: {
      Icon: QuestionIcon,
      title: "Lindholmspiren",
      body: "With Älvsborgbron as inspiration, use your bodys to form a bridge together in your group. Everyone should be part of the construction. You have 60 seconds.",
      doneLabel: "Done",
    },
    congrats: {
      Icon: PuzzleIcon,
      title: "Congratulations!",
      body: "You’re third quest was successful and you’ve collected another Puzzle Piece. Head to your next location to discover more of Lindholmen!",
      nextLabel: "Next location",
    },
  },
  {
    key: "backateater",
    pre: {
      title: "Walk to the marked location",
      body: "Follow the path to reach your last location.",
      distanceLabel: "Distance remaining",
    },
    overlay: { text: "Unlock the location" },
    task: {
      title: "Backa Teatern",
      body: "Each person says their favorite line from a movie with emotion. The rest of the group guesses which movie the line is from. Continue until everyone has had a chance to say their line",
      doneLabel: "Done",
    },
    congrats: {
      Icon: PuzzleIcon,
      title: "Well done!",
      body: "You completed the Lindholmen Walk!",
      nextLabel: "Next location",
    },
  },
];
