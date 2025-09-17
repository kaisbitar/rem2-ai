import StatsSection from "@/components/popup/StatsSection";
import ServicesSection from "@/components/popup/ServicesSection";
import type React from "react";
import { css, cx } from "styled-system/css";
import Header from "@/components/popup/Header";
// import { Footer } from "@/components/common/Footer";
import { useAuth } from "@/context/AuthContext";
import DonationBanner from "@/components/popup/DonationBanner";
import { useUserState } from "@/context/UserStateContext";
import BottomTabs from "@/components/common/BottomTabs";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import { useNavigate } from "react-router-dom";

const InsightsPage: React.FC = () => {
	const { loading: authLoading } = useAuth();
	const { isGuest } = useUserState();
	const navigate = useNavigate();
	const [filter, setFilter] = useState<"today" | "7d" | "30d" | "lifetime">(
		"today",
	);
	const [softwallOpen, setSoftwallOpen] = useState(false);

	if (authLoading) {
		return <div className={css({ padding: "5" })}>Loading…</div>;
	}

	const containerClasses = css({
		// background: "white",
		// borderRadius: "0",
		// margin: "0",
		// boxShadow: "none",
		// color: "gray.700",
		// height: "50px !important",
	});

	const mainClasses = css({
		padding: "5",
		paddingTop: "5px",
		paddingBottom: "56px", // leave space for tabs
		flex: 1,
	});

	// const footerClasses = css({
	//     transition: "opacity .4s ease-in-out, height .5s ease",
	// });

	const filtersRow = css({
		display: "flex",
		gap: "2",
		marginBottom: "3",
	});

	const chip = css({
		paddingX: "3",
		paddingY: "1",
		borderRadius: "full",
		border: "1px solid",
		borderColor: "gray.200",
		fontSize: "xs",
		color: "gray.700",
		cursor: "pointer",
		backgroundColor: "white",
	});

	const chipActive = css({
		backgroundColor: "gray.100",
		borderColor: "gray.300",
		fontWeight: 600,
	});

	const guestBadge = isGuest ? (
		<div
			className={css({
				backgroundColor: "yellow.50",
				border: "1px solid",
				borderColor: "yellow.200",
				color: "yellow.900",
				fontSize: "sm",
				padding: "2",
				borderRadius: "md",
				marginBottom: "3",
			})}
		>
			Tracking on this device only. Create a free account to keep your history.
		</div>
	) : null;

	return (
		<div className={containerClasses}>
			<Header />
			<main className={mainClasses}>
				<DonationBanner />
				{guestBadge}

				<div className={filtersRow}>
					{(
						[
							{ id: "today", label: "Today" },
							{ id: "7d", label: "7 days" },
							{ id: "30d", label: "30 days" },
							{ id: "lifetime", label: "Lifetime" },
						] as const
					).map((f) => (
						<button
							key={f.id}
							type="button"
							className={cx(chip, filter === f.id && chipActive)}
							onClick={() => {
								if (f.id !== "today" && isGuest) {
									setSoftwallOpen(true);
									return;
								}
								setFilter(f.id);
							}}
						>
							{f.label}
						</button>
					))}
				</div>

				<div className={css({ overflow: "hidden" })}>
					<StatsSection />
					<ServicesSection />
				</div>

				{/* <div className={footerClasses}>
                    <Footer />
                </div> */}
			</main>
			<BottomTabs />

			<Modal open={softwallOpen} onClose={() => setSoftwallOpen(false)}>
				<div
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "3",
					})}
				>
					<h3 className={css({ fontWeight: 700 })}>Save your footprint</h3>
					<p className={css({ fontSize: "sm", color: "gray.700" })}>
						Create a free account to unlock 7-day, 30-day and lifetime history
						across devices.
					</p>
					<div
						className={css({
							display: "flex",
							gap: "2",
							justifyContent: "flex-end",
						})}
					>
						<button
							type="button"
							className={css({
								paddingX: "3",
								paddingY: "2",
								borderRadius: "sm",
								backgroundColor: "gray.100",
							})}
							onClick={() => setSoftwallOpen(false)}
						>
							Not now
						</button>
						<button
							type="button"
							className={css({
								paddingX: "3",
								paddingY: "2",
								borderRadius: "sm",
								backgroundColor: "green.600",
								color: "white",
							})}
							onClick={() => navigate("/signup")}
						>
							Create free account
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default InsightsPage;
