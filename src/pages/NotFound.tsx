import { Link } from "react-router-dom";
import SubpageLayout from "./SubpageLayout";
import { notFoundMeta } from "../seo/meta";

const NotFound = () => (
  <SubpageLayout meta={notFoundMeta()}>
    <section className="wrap sub-empty">
      <p className="sub-kicker">404</p>
      <h1>
        This page <span className="serif-accent">doesn&apos;t exist</span>
      </h1>
      <Link to="/projects" className="btn-outline" data-cursor="hide">
        Browse projects
      </Link>
    </section>
  </SubpageLayout>
);

export default NotFound;
