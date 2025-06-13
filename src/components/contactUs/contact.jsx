import React, { useEffect, useState } from 'react';
import {
    Box, Typography, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button, TextField, Grid, Card, CardContent,
    Chip, Avatar, Fade, Slide, useTheme, useMediaQuery,
    Container, Divider, Stack, Alert, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Contact() {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [editData, setEditData] = useState({
        _id: '',
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://parishram-contruction-admin.onrender.com/api/all");
            setContacts(res.data);
            setFilteredContacts(res.data);
            setSnackbar({ open: true, message: 'Contacts loaded successfully!', severity: 'success' });
        } catch (err) {
            console.error("Error fetching contacts:", err);
            setSnackbar({ open: true, message: 'Failed to load contacts', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://parishram-contruction-admin.onrender.com/api/${deleteId}`);
            const updatedContacts = contacts.filter(item => item._id !== deleteId);
            setContacts(updatedContacts);
            setFilteredContacts(updatedContacts);
            setSnackbar({ open: true, message: 'Contact deleted successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error deleting contact:', error);
            setSnackbar({ open: true, message: 'Failed to delete contact', severity: 'error' });
        } finally {
            setConfirmOpen(false);
            setDeleteId(null);
        }
    };

    const handleEditOpen = (contact) => {
        setEditData(contact);
        setEditOpen(true);
    };

    const handleInfoOpen = (contact) => {
        setSelectedContact(contact);
        setInfoOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        try {
            await axios.put(`https://parishram-contruction-admin.onrender.com/api/${editData._id}`, editData);
            const updatedContacts = contacts.map(c => (c._id === editData._id ? editData : c));
            setContacts(updatedContacts);
            setFilteredContacts(updatedContacts);
            setSnackbar({ open: true, message: 'Contact updated successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error updating contact:', error);
            setSnackbar({ open: true, message: 'Failed to update contact', severity: 'error' });
        } finally {
            setEditOpen(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === '') {
            setFilteredContacts(contacts);
        } else {
            const filtered = contacts.filter(contact =>
                contact.name.toLowerCase().includes(term) ||
                contact.email.toLowerCase().includes(term) ||
                contact.phone.includes(term)
            );
            setFilteredContacts(filtered);
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Mobile Card View Component - FIXED
    const MobileContactCard = ({ contact }) => (
        <Fade in timeout={300}>
            <Card
                sx={{
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                    }
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                        {/* Header with Avatar and Name */}
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={2} flex={1}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        width: 50,
                                        height: 50,
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    {getInitials(contact.name)}
                                </Avatar>
                                <Box flex={1}>
                                    <Typography variant="h6" fontWeight="bold" color="primary" noWrap>
                                        {contact.name}
                                    </Typography>
                                    <Chip
                                        label={formatDate(contact.createdAt)}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        icon={<DateRangeIcon />}
                                        sx={{ mt: 0.5 }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Divider />

                        {/* Contact Details */}
                        <Stack spacing={1.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <EmailIcon color="action" fontSize="small" />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        wordBreak: 'break-word',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {contact.email}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <PhoneIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.secondary">
                                    {contact.phone}
                                </Typography>
                            </Box>
                            {contact.subject && (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <SubjectIcon color="action" fontSize="small" />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {contact.subject}
                                    </Typography>
                                </Box>
                            )}
                            <Box display="flex" alignItems="flex-start" gap={1}>
                                <MessageIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: 1.4
                                    }}
                                >
                                    {contact.message}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider />

                        {/* Action Buttons - FIXED */}
                        <Box
                            display="flex"
                            justifyContent="center"
                            gap={1}
                            sx={{ pt: 1 }}
                        >
                            <Button
                                variant="outlined"
                                color="info"
                                size="small"
                                startIcon={<RemoveRedEyeIcon />}
                                onClick={() => handleInfoOpen(contact)}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    minWidth: 'auto',
                                    px: 2,
                                    py: 1
                                }}
                            >
                                View
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditOpen(contact)}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    minWidth: 'auto',
                                    px: 2,
                                    py: 1
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => {
                                    setDeleteId(contact._id);
                                    setConfirmOpen(true);
                                }}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    minWidth: 'auto',
                                    px: 2,
                                    py: 1
                                }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Fade>
    );

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                {/* Header Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            display: { xs: 'none', md: 'block' }
                        }}
                    />
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Box>
                            <Typography
                                variant={isMobile ? "h4" : "h3"}
                                fontWeight="bold"
                                gutterBottom
                                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                            >
                                <ContactMailIcon sx={{ fontSize: 'inherit' }} />
                                Contact Management
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Manage and track all contact submissions
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="inherit"
                            startIcon={<RefreshIcon />}
                            onClick={fetchContacts}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                            }}
                        >
                            Refresh
                        </Button>
                    </Stack>
                </Paper>

                {/* Search and Stats */}
                <Paper
                    elevation={2}
                    sx={{ p: 3, mb: 3, borderRadius: 3 }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search contacts..."
                                value={searchTerm}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Chip
                                    label={`Total: ${contacts.length}`}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold' }}
                                />
                                <Chip
                                    label={`Showing: ${filteredContacts.length}`}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Content */}
                {loading ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        py={8}
                    >
                        <CircularProgress size={60} thickness={4} />
                        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                            Loading contacts...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Mobile View */}
                        {isMobile ? (
                            <Box>
                                {filteredContacts.length === 0 ? (
                                    <Paper
                                        sx={{
                                            p: 6,
                                            textAlign: 'center',
                                            borderRadius: 3,
                                            bgcolor: 'grey.50'
                                        }}
                                    >
                                        <ContactMailIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary">
                                            No contacts found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {searchTerm ? 'Try adjusting your search criteria' : 'Contact submissions will appear here'}
                                        </Typography>
                                    </Paper>
                                ) : (
                                    filteredContacts.map(contact => (
                                        <MobileContactCard key={contact._id} contact={contact} />
                                    ))
                                )}
                            </Box>
                        ) : (
                            /* Desktop/Tablet Table View */
                            <TableContainer
                                component={Paper}
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                    overflow: 'hidden'
                                }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <PersonIcon fontSize="small" />
                                                    Contact
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold',fontSize: '1.1rem' }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <EmailIcon fontSize="small" />
                                                    Email
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold',fontSize: '1.1rem' }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <PhoneIcon fontSize="small" />
                                                    Phone
                                                </Box>
                                            </TableCell>
                                            {!isTablet && (
                                                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold',fontSize: '1.1rem' }}>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <MessageIcon fontSize="small" />
                                                        Message
                                                    </Box>
                                                </TableCell>
                                            )}
                                            <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold',fontSize: '1.1rem' }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <DateRangeIcon fontSize="small" />
                                                    Date
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold',fontSize: '1.1rem' }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredContacts.map((contact, index) => (
                                            <Fade in timeout={300 + index * 100} key={contact._id}>
                                                <TableRow
                                                    hover
                                                    sx={{
                                                        '&:hover': {
                                                            bgcolor: 'action.hover',
                                                            transform: 'scale(1.002)'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: 'primary.main',
                                                                    width: 40,
                                                                    height: 40
                                                                }}
                                                            >
                                                                {getInitials(contact.name)}
                                                            </Avatar>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {contact.name}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {contact.email}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {contact.phone}
                                                        </Typography>
                                                    </TableCell>
                                                    {!isTablet && (
                                                        <TableCell>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    maxWidth: 300,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                {contact.message}
                                                            </Typography>
                                                        </TableCell>
                                                    )}
                                                    <TableCell>
                                                        <Chip
                                                            label={formatDate(contact.createdAt)}
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            color="info"
                                                            onClick={() => handleInfoOpen(contact)}
                                                            sx={{ mr: 0.5 }}
                                                        >
                                                            <RemoveRedEyeIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleEditOpen(contact)}
                                                            sx={{ mr: 0.5 }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => {
                                                                setDeleteId(contact._id);
                                                                setConfirmOpen(true);
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            </Fade>
                                        ))}
                                    </TableBody>
                                </Table>

                                {filteredContacts.length === 0 && (
                                    <Box sx={{ p: 6, textAlign: 'center' }}>
                                        <ContactMailIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary">
                                            No contacts found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {searchTerm ? 'Try adjusting your search criteria' : 'Contact submissions will appear here'}
                                        </Typography>
                                    </Box>
                                )}
                            </TableContainer>
                        )}
                    </>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    TransitionComponent={Transition}
                    PaperProps={{
                        sx: { borderRadius: 3 }
                    }}
                >
                    <DialogTitle sx={{ pb: 1 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <DeleteIcon color="error" />
                            Delete Confirmation
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ fontSize: '1rem' }}>
                            Are you sure you want to delete this contact? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={() => setConfirmOpen(false)}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleDelete}
                            sx={{ borderRadius: 2 }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    maxWidth="md"
                    fullWidth
                    fullScreen={isMobile}
                    TransitionComponent={Transition}
                    PaperProps={{
                        sx: { borderRadius: isMobile ? 0 : 3 }
                    }}
                >
                    <DialogTitle sx={{ pb: 1 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <EditIcon color="primary" />
                            Edit Contact
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleEditChange}
                                    InputProps={{
                                        startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleEditChange}
                                    InputProps={{
                                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={editData.phone}
                                    onChange={handleEditChange}
                                    InputProps={{
                                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Subject"
                                    name="subject"
                                    value={editData.subject}
                                    onChange={handleEditChange}
                                    InputProps={{
                                        startAdornment: <SubjectIcon sx={{ mr: 1, color: 'action.active' }} />
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    label="Message"
                                    name="message"
                                    value={editData.message}
                                    onChange={handleEditChange}
                                    minRows={4}                // 👈 Start with 4 rows
                                    maxRows={10}               // 👈 Auto-grow up to 10 rows
                                    InputProps={{
                                        startAdornment: (
                                            <MessageIcon
                                                sx={{
                                                    mr: 1,
                                                    color: 'action.active',
                                                    alignSelf: 'flex-start',
                                                    mt: 1
                                                }}
                                            />
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />

                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={() => setEditOpen(false)}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleEditSave}
                            sx={{ borderRadius: 2 }}
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ borderRadius: 2 }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {/* Info Dialog */}
                <Dialog
                    open={infoOpen}
                    onClose={() => setInfoOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    fullScreen={isMobile}
                    TransitionComponent={Transition}
                    PaperProps={{
                        sx: { borderRadius: isMobile ? 0 : 3 }
                    }}
                >
                    <DialogTitle sx={{ pb: 1, bgcolor: 'primary.main', color: 'white' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <RemoveRedEyeIcon />
                            Contact Details
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 0 }}>
                        {selectedContact && (
                            <Box>
                                {/* Header Section */}
                                <Box
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 80,
                                            height: 80,
                                            fontSize: '1.8rem',
                                            mx: 'auto',
                                            mb: 2
                                        }}
                                    >
                                        {getInitials(selectedContact.name)}
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {selectedContact.name}
                                    </Typography>
                                    <Chip
                                        label={formatDate(selectedContact.createdAt)}
                                        color="primary"
                                        variant="outlined"
                                        icon={<DateRangeIcon />}
                                    />
                                </Box>

                                {/* Details Section */}
                                <Box sx={{ p: 3 }}>
                                    <Stack spacing={3}>
                                        {/* Email */}
                                        <Box>
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <EmailIcon color="primary" />
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                                                    Email Address
                                                </Typography>
                                            </Box>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200'
                                                }}
                                            >
                                                <Typography variant="body1">
                                                    {selectedContact.email}
                                                </Typography>
                                            </Paper>
                                        </Box>

                                        {/* Phone */}
                                        <Box>
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <PhoneIcon color="primary" />
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                                                    Phone Number
                                                </Typography>
                                            </Box>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200'
                                                }}
                                            >
                                                <Typography variant="body1">
                                                    {selectedContact.phone}
                                                </Typography>
                                            </Paper>
                                        </Box>

                                        {/* Subject */}
                                        <Box>
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <SubjectIcon color="primary" />
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                                                    Subject
                                                </Typography>
                                            </Box>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200'
                                                }}
                                            >
                                                <Typography variant="body1">
                                                    {selectedContact.subject}
                                                </Typography>
                                            </Paper>
                                        </Box>

                                        {/* Message */}
                                        <Box>
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <MessageIcon color="primary" />
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                                                    Message
                                                </Typography>
                                            </Box>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200',
                                                    minHeight: 100
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        whiteSpace: 'pre-wrap',
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {selectedContact.message}
                                                </Typography>
                                            </Paper>
                                        </Box>

                                        {/* Submission Details */}
                                        <Box>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                                                Submission ID: {selectedContact._id}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, bgcolor: 'grey.50' }}>
                        <Button
                            onClick={() => setInfoOpen(false)}
                            variant="contained"
                            sx={{ borderRadius: 2 }}
                            fullWidth={isMobile}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
}

export default Contact;