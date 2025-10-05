import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BeforeLoginNavbar from "components/Navbars/BeforeLoginNavbar";
import AfterLoginNavbar from "components/Navbars/AfterLoginNavbar.js";

import * as Service from "services/Service.js";

const HomePage = (props) => {
  React.useEffect(() => {}, []);

  return (
    <div>
       <div class="topHeader">
          <h4>
            <a href="javascript:void(0)" onClick={() => props.history.push("/home")}>Home</a>
          </h4>
        </div>

      <h3>iTrack BA</h3>
      <h4>
        Enabling you to identify and mitigate the intrinsic risk in your
        operations, supply chains and business processes.
      </h4>

      <div class="homecontent">
        <p>
          Intertek leads the way in Assurance solutions, offering unparalleled
          expertise in identifying and mitigating risks in operations, supply
          chains, and business processes. Our approach transcends traditional
          testing, inspection, and certification, delving into the core elements
          that drive the success of your company and its products. With
          Intertek, gain confidence and peace of mind that your procedures,
          systems, and personnel are optimized, providing you with a distinct
          competitive edge in the market.
        </p>
        <p>
          Our Assurance solutions are designed to offer you total peace of mind.
          We ensure that your operating procedures, systems, and people are
          functioning at their best, giving you a competitive advantage in the
          marketplace. Through our comprehensive services, including thorough
          auditing, performance benchmarking, and detailed supply chain
          analysis, we provide valuable insights into every aspect of your
          operations, enabling you to make informed and strategic business
          decisions.
        </p>

        <p>
          Our training services are tailored to ensure that your workforce's
          competencies are current and relevant to your industry's evolving
          demands. Our global team of experts brings their extensive knowledge
          and experience to assist our clients in a variety of areas, from
          assessing overall performance and improving the quality and
          productivity of laboratories, to identifying and mitigating risks,
          streamlining manufacturing processes, and optimizing supply chains.
        </p>

        <p>
          At Intertek, our ability to provide tailored quality assurance
          solutions is unparalleled. We are committed to satisfying the diverse
          needs of our customers, offering a wide variety of solutions across
          numerous industries. Intertek is your Trusted Partner for Assurance
          solutions that not only meet your requirements but also exceed your
          expectations, solidifying your position as a leader in your industry.
        </p>

        <p>
          Intertek Assurance does not provide consulting services for management
          systems certification. Any consulting activities provided by Intertek
          are separated and independent from testing and certification
          activities.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
