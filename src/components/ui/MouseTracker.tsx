import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

interface MouseTrackerProps {
	onClick: () => void;
	isPaused: boolean;
}

export default function MouseTracker({ onClick, isPaused }: MouseTrackerProps) {
	const [visible, setVisible] = useState<boolean>(false);
	const [inactive, setInactive] = useState<boolean>(false);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		const handleMouseMove = () => {
			setVisible(true);
			setInactive(false);
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				setVisible(false);
				setInactive(true);
			}, 1000);
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			clearTimeout(timeout);
		};
	}, []);

	return (
		<div
			className={`fixed inset-0 z-[200] ${inactive ? 'cursor-none' : ''} pointer-events-none`}
		>
			<AnimatePresence>
				{visible && (
					<motion.div
						className="fixed left-1/2 bottom-32 -translate-x-1/2 cursor-pointer pointer-events-auto"
						initial={{ opacity: 0, y: 50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 50, scale: 0.9 }}
						transition={{ duration: 0.4, ease: 'easeInOut' }}
						onClick={onClick}
					>
						{isPaused ? (
							<Play className="w-20 h-20 text-white opacity-90 drop-shadow-[0_0_20px_rgba(158,255,255,0.8)]" />
						) : (
							<Pause className="w-20 h-20 text-white opacity-90 drop-shadow-[0_0_20px_rgba(158,255,255,0.8)]" />
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
