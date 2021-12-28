import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import './styles/LevelBar.css';

const LevelBar = ({
  alignRight,
  className,
  handleClassName,
  size,
  background,
  onChange,
  value,
  color,
}) => {
  const bar = useRef(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const mouseDown = event => {
      if (bar.current.contains(event.target)) {
        setEditing(true);
      }
    };
    const mouseMove = event => {
      if (editing) {
        // Y coordinate difference as [0,1] (0 is full saturation)
        const yDifference = event.clientY - bar.current.getBoundingClientRect().y;
        const s = (1 - Math.min(size, Math.max(0, yDifference)) / size) * 100;
        onChange(parseFloat(s.toFixed(2)));
      }
    };
    const mouseUp = () => setEditing(false);

    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [editing, onChange, size]);

  const indicatorPosition = useMemo(() => {
    const top = size * (0.6 * (1 - Math.sin(Math.asin(3 / 4) * (value / 50 - 1))) - 1 / 10);
    return { top };
  }, [value, size]);

  return (
    <div
      ref={bar}
      className={className}
      style={{
        position: 'absolute',
        height: size,
        width: '15px',
        transform: alignRight ? 'scaleX(-1)' : '',
        cursor: 'grab',
      }}
    >
      <div
        className="barBackground"
        style={{
          background,
          marginTop: size / 20,
        }}
      />
      <div
        className={handleClassName}
        style={{
          top: indicatorPosition.top,
          backgroundColor: color,
          left: 0,
          width: 15,
          height: 5,
          border: '2px solid white',
        }}
      />
    </div>
  );
};

LevelBar.propTypes = {
  /** Whether bar is aligned to right */
  alignRight: PropTypes.bool,
  /** Css class name for outer div */
  className: PropTypes.string,
  /** Css class name for handle */
  handleClassName: PropTypes.string,
  /** Background in css format */
  background: PropTypes.string,
  /** height of the bar */
  size: PropTypes.number.isRequired,
  /** zero saturation color string in css hsl format (hsl(0, 5%, 10%)). */
  onChange: PropTypes.func,
  /** current value level ([0,100]) */
  value: PropTypes.number,
  /** current color in hexa */
  color: PropTypes.number,
};

LevelBar.defaultProps = {
  alignRight: false,
  className: 'levelBar',
  handleClassName: 'defaultHandle',
  background: 'black',
  onChange: (() => {}),
  value: 100,
  color: 0,
};
export default LevelBar;
