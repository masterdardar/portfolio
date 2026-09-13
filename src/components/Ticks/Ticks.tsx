import type { CSSProperties } from "react";

type Props = {
	size?: number; // tick arm length, default 10
	inset?: number; // offset from the frame edge, default 6
	color?: string; // default var(--tick)
};

/** Four L-shaped 1px corner marks. Host must be `position: relative`. */
function Ticks({ size = 10, inset = 6, color }: Props) {
	const style = {
		"--tk-size": `${size}px`,
		"--tk-inset": `${inset}px`,
		...(color ? { "--tk-color": color } : {}),
	} as CSSProperties;
	return (
		<span className="tk" style={style} aria-hidden="true">
			<i className="tk-tl" />
			<i className="tk-tr" />
			<i className="tk-bl" />
			<i className="tk-br" />
		</span>
	);
}

export default Ticks;
