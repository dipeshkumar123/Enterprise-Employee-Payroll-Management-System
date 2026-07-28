import { useMutation } from '@tanstack/react-query';
import { Button } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { downloadPayslipPDF } from '../../services/payrollService';

const DownloadPDFButton = ({ id, label = 'Download PDF', onSuccess, onError }) => {
  const mutation = useMutation({
    mutationFn: () => downloadPayslipPDF(id),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      onSuccess?.();
    },
    onError: (err) => {
      console.error('Failed to download PDF', err);
      onError?.(err);
    },
  });

  return (
    <Button
      variant="outlined"
      startIcon={<PictureAsPdf />}
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      size="small"
    >
      {mutation.isPending ? 'Downloading...' : label}
    </Button>
  );
};

export default DownloadPDFButton;