import {tryCatch} from './error.utils';

type UserData = {
    name: string;
    age: number;
    email: string;
};

const TryCatchTest = () => {

    const fetchUserProfile = async (userId: string): Promise<UserData> => {
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!userId || userId.length < 3) {
            throw new Error('Invalid user ID format');
        }
        const rawData = {
            user_name: 'John Doe',
            user_age: 30,
            user_email: 'john@example.com'
        };
        if (userId === '123') {
            throw new Error('Failed to fetch user profile: Network timeout');
        } else {
            return rawData;
        }
    }


    const handleErrorsOldWay = async () => {

        let userProfile: UserData | null = null;
        let moreUser: UserData | null = null;
        let isValid = false;

        const userId = 'user123';
        if (userId) {
            console.log(`Fetching profile for user: ${userId}`);
            try {
                const normalizedId = userId.trim().toLowerCase();
                if (normalizedId.length > 2) {
                    isValid = true;
                    if (isValid) {
                        userProfile = await fetchUserProfile(normalizedId);
                        if (userProfile && userProfile.name) {
                            try {
                                moreUser = await fetchUserProfile(normalizedId);
                            } catch (error) {
                                console.error('Error occurred during fetch');
                            }

                        }
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`Error details: }`);
                }
            }
        }
        if (userProfile) {
            const displayName = userProfile.name.toUpperCase();
            console.log(displayName);
        }
        if (moreUser) {
            console.log(`Processing user: ${moreUser.name}, age: ${moreUser.age}`);
        }
    }

    const handleErrorsNewWay = async () => {
        const userId = 'user123';
        console.log(`Fetching profile for user: ${userId}`);
        const { data: user, error: someError } = await tryCatch(fetchUserProfile(userId));
        if (someError) {
            console.error(`Error: ${someError.message}`);
            return;
        }
        const { data: moreUser, error: anotherError } = await tryCatch(fetchUserProfile(user.name));
        if (anotherError) return {error: 'Unable to fetch user'};
        console.log(`Processing user: ${moreUser.name}, age: ${moreUser.age}`);
    }


    return (
        <div>
        </div>
    );
};

export default TryCatchTest;