import React from "react";
import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">LearnMaster?</span>
      </h1>
      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins">
          Welcome to LearnMaster, your ultimate companion in the journey of
          education and skill development. LearnMaster is a transformative
          Learning Management System (LMS) designed to empower learners,
          educators, and institutions with innovative and intuitive tools.
          <br />
          <br />
          Our platform simplifies and enhances the learning experience with
          modern technology, ensuring accessibility, engagement, and
          flexibility. We bridge the gap between learners and knowledge through
          tailored learning paths, interactive content delivery, and robust
          analytics.
          <br />
          <br />
          With a user-friendly interface, LearnMaster caters to students,
          instructors, and administrators alike. Our collaboration tools foster
          communication, while our integration capabilities provide a seamless
          learning ecosystem.
          <br />
          <br />
          At LearnMaster, we believe that education should be limitless and
          inclusive. Our mission is to revolutionize education by providing a
          platform where learning knows no boundaries. Whether youre an
          individual learner or an institution, LearnMaster adapts to your
          needs, helping you achieve your goals.
          <br />
          <br />
          Join the LearnMaster community today and unlock your full potential.
          With our cutting-edge features and supportive environment, the future
          of education is here.
        </p>
        <br />
        <br />
        <br />
      </div>

      <br />
      <br />
    </div>
  );
};

export default About;
