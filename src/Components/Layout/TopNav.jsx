

const TopNav = ({ showTopNav }) => {

  if (!showTopNav) return null;

  return (
    <nav className="wapper-header">
      <div className="nav">
        <span className="heading">Demo</span>
      </div>
    </nav>
  );
};

export default TopNav;
