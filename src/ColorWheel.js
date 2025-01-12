import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import './styles/ColorWheel.css';
import { coordinatesToHS, hsToCoordinates } from './helpers/utils';
import LevelBar from './LevelBar';

const ColorWheel = ({
  color,
  size,
  setColor,
  shadesBar,
  brightnessBar,
}) => {
  const wheel = useRef(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const mouseDown = event => {
      if (wheel.current.contains(event.target)) {
        setEditing(true);
      }
    };
    const mouseUp = () => {
      setEditing(false);
    };
    const mouseMove = event => {
      if (editing) {
        setColor(
          coordinatesToHS(
            (event.clientX - wheel.current.getBoundingClientRect().x) / size,
            (event.clientY - wheel.current.getBoundingClientRect().y) / size,
          ),
        );
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('mousemove', mouseMove);
    };
  }, [editing, setColor, size]);

  const { x, y } = hsToCoordinates(color.h, color.s);

  const onMouseDown = useCallback(event => {
    setColor(
      coordinatesToHS(
        (event.clientX - event.currentTarget.getBoundingClientRect().x) / size,
        (event.clientY - event.currentTarget.getBoundingClientRect().y) / size,
      ),
    );
  }, [setColor, size]);

  return (
    <div className="colorWheel">
      {shadesBar && (
        <LevelBar
          className="saturationBar"
          size={size}
          background={`linear-gradient(hsl(${color.h},100%,${color.l}%),hsl(${color.h},0%,${color.l}%))`}
          onChange={saturation => setColor({ s: saturation })}
          value={color.s}
          color={color.h}
        />
      )}
      <div
        ref={wheel}
        style={{
          width: size,
          height: size,
        }}
        className="wheel"
        onMouseDown={onMouseDown}
        role="button"
        tabIndex={-5}
      >
        <div
          className="handle"
          style={{
            top: y * size,
            left: x * size,
            width: size / 10,
            height: size / 10,
            border: `${size / 50}px solid white`,
          }}
        />
      </div>
      {brightnessBar && (
        <LevelBar
          alignRight
          className="lightnessBar"
          size={size}
          background={`linear-gradient(white,hsl(${color.h},${color.s}%,50%), black)`}
          onChange={lightness => setColor({ l: lightness })}
          value={color.l}
          color={color.h}
        />
      )}
    </div>
  );
};

ColorWheel.propTypes = {
  /** Current picked color */
  color: PropTypes.shape({
    h: PropTypes.number,
    s: PropTypes.number,
    l: PropTypes.number,
  }),
  /** Size of color wheel */
  size: PropTypes.number.isRequired,
  /** Callback function to set color */
  setColor: PropTypes.func.isRequired,
  brightnessBar: PropTypes.bool,
  shadesBar: PropTypes.bool,
};

ColorWheel.defaultProps = {
  color: {
    h: 0,
    s: 100,
    l: 50,
  },
  brightnessBar: true,
  shadesBar: true,
};
export default ColorWheel;
