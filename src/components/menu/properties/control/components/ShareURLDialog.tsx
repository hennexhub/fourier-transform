import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useCallback} from "react";

export const ShareURLDialog = ({
                                   open,
                                   onOpenChange,
                                   url
                               }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(url);
    };

    const preventAutoFocus = useCallback((e: Event) => {
        e.preventDefault?.();
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md" aria-describedby={undefined} autoFocus={false}
                           onOpenAutoFocus={preventAutoFocus}
                           onCloseAutoFocus={preventAutoFocus}>
                <DialogHeader>
                    <DialogTitle>Share Settings</DialogTitle>
                    <DialogDescription/>
                </DialogHeader>

                <div className="mt-2">
                    <Textarea
                        readOnly
                        value={url}
                        className="h-32 resize-none font-mono text-black bg-white"
                    />
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={handleCopy}>Copy</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
