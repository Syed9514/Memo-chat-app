import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeToggle = () => {
	const { theme, setTheme } = useThemeStore();

	const handleThemeChange = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
	};

	return (
		<label className='swap swap-rotate'>
			{/* this hidden checkbox controls the state */}
			<input type='checkbox' checked={theme === "light"} onChange={handleThemeChange} />

			{/* sun icon */}
			<Sun className='swap-on fill-current w-6 h-6' />

			{/* moon icon */}
			<Moon className='swap-off fill-current w-6 h-6' />
		</label>
	);
};

export default ThemeToggle;